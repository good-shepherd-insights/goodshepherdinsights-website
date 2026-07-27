import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import matter from 'gray-matter'
import {parseHTML} from 'linkedom'
import {marked} from 'marked'
import {createClient} from '@sanity/client'

const studioRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(studioRoot, '..')
const sourceDirectory = path.join(workspaceRoot, 'src/content/blog/english')
const tokenPath = path.join(os.homedir(), '.config', 'sanity', 'config.json')
const authToken = JSON.parse(fs.readFileSync(tokenPath, 'utf8')).authToken
const client = createClient({
  projectId: '8yy9mp89',
  dataset: 'production',
  apiVersion: '2026-01-01',
  token: authToken,
  useCdn: false,
})
const defaultSourcePath = path.join(
  workspaceRoot,
  'src/content/blog/english/rolling-out-ai-in-church-management-software.mdx',
)
const sourceArgIndex = process.argv.indexOf('--source')
const sourceArgValue =
  sourceArgIndex >= 0 && process.argv[sourceArgIndex + 1]
    ? process.argv[sourceArgIndex + 1]
    : null
const explicitSourcePath = sourceArgValue ? resolveSourcePath(sourceArgValue) : null
const dryRun = process.argv.includes('--dry-run')
const sourcePaths = process.argv.includes('--all')
  ? fs
      .readdirSync(sourceDirectory)
      .filter((fileName) => fileName.endsWith('.mdx'))
      .sort()
      .map((fileName) => path.join(sourceDirectory, fileName))
  : [explicitSourcePath || defaultSourcePath]

for (const sourcePath of sourcePaths) {
  await migrate(sourcePath)
}

async function migrate(sourcePath) {
  const source = fs.readFileSync(sourcePath, 'utf8')
  const {data: frontmatter, content: bodySource} = matter(source)
  const slug = frontmatter.customSlug || frontmatter.slug
  if (!slug) throw new Error(`Missing slug in ${sourcePath}`)
  const documentId = `blogPost-${slug}`
  const body = toStructuredBody(htmlToPortableText(bodySource))

  const imagePath = frontmatter.image
    ? path.join(workspaceRoot, 'src/assets', frontmatter.image.replace(/^\//, ''))
    : undefined

  if (imagePath && !fs.existsSync(imagePath)) {
    throw new Error(`Cover image does not exist: ${imagePath}`)
  }

  let coverImage

  if (imagePath) {
    if (dryRun) {
      coverImage = {
        asset: {_type: 'reference', _ref: 'asset-would-be-uploaded'},
        alt: frontmatter.imageAlt,
      }
    } else {
      const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
        filename: path.basename(imagePath),
      })
      coverImage = {
        _type: 'image',
        asset: {_type: 'reference', _ref: asset._id},
        alt: frontmatter.imageAlt || frontmatter.title,
      }
    }
  }

  const document = {
    _id: documentId,
    _type: 'blogPost',
    title: frontmatter.title,
    slug: {_type: 'slug', current: slug},
    publishedAt: toIsoDate(frontmatter.date),
    author: frontmatter.author || 'Good Shepherd Insights',
    excerpt: frontmatter.metaDescription,
    metaTitle: frontmatter.metaTitle || frontmatter.title,
    metaDescription: frontmatter.metaDescription,
    keywords: frontmatter.keywords || [],
    ...(coverImage ? {coverImage} : {}),
    body,
    categories: frontmatter.categories || [],
    tags: frontmatter.tags || [],
    comments: Number.isInteger(frontmatter.comments) ? frontmatter.comments : 0,
    commentList: frontmatter.commentList || [],
    draft: Boolean(frontmatter.draft),
    excludeFromSitemap: Boolean(frontmatter.excludeFromSitemap),
  }

  function toStructuredBody(blocks) {
    const structured = []

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index]
      const text = blockText(block)

      if (block._type === 'block' && /^TL;DR\s*:/i.test(text)) {
        structured.push({
          _type: 'tldr',
          _key: `tldr-${index}`,
          text: [stripBlockPrefix(block, /^TL;DR\s*:\s*/i, `tldr-${index}`)],
        })
        continue
      }

      if (
        block._type === 'block' &&
        block.style === 'normal' &&
        /^(Key Point|Key Insight)\s*:/i.test(text)
      ) {
        const match = text.match(/^(Key Point|Key Insight)\s*:\s*/i)
        structured.push({
          _type: 'callout',
          _key: `callout-${index}`,
          label: match[1].replace('point', 'Point').replace('insight', 'Insight'),
          text: [stripBlockPrefix(block, match[0], `callout-${index}`)],
        })
        continue
      }

      const insightList = parseInsightList(blocks, index)
      if (insightList) {
        structured.push(insightList._value)
        index = insightList.end
        continue
      }

      if (isHeading(block) && /^Key Takeaways(?::|$)/i.test(text)) {
        const items = []
        let cursor = index + 1
        while (cursor < blocks.length && blocks[cursor].listItem) {
          items.push({
            _type: 'takeawayItem',
            _key: `takeaway-${index}-${items.length}`,
            text: [cloneInlineBlock(blocks[cursor], `takeaway-${index}-${items.length}`)],
          })
          cursor += 1
        }
        if (items.length) {
          structured.push({_type: 'takeaways', _key: `takeaways-${index}`, heading: text, items})
          index = cursor - 1
          continue
        }
      }

      if (isHeading(block) && /^Table of Contents$/i.test(text)) {
        structured.push({
          _type: 'tableOfContents',
          _key: `toc-${index}`,
          title: text,
        })
        while (index + 1 < blocks.length && blocks[index + 1].listItem) {
          index += 1
        }
        continue
      }

      if (isHeading(block) && /^Frequently Asked Questions/i.test(text)) {
        const result = parseFaq(blocks, index)
        if (result) {
          structured.push(result._value)
          index = result.end
          continue
        }
      }

      if (isHeading(block) && /^Sources and References$/i.test(text)) {
        const result = parseSources(blocks, index)
        if (result) {
          structured.push(result._value)
          index = result.end
          continue
        }
      }

      const framework = parseFramework(blocks, index)
      if (framework) {
        structured.push(framework._value)
        index = framework.end
        continue
      }

      const vendor = parseVendorProfile(blocks, index)
      if (vendor) {
        structured.push(vendor._value)
        index = vendor.end
        continue
      }

      const useCase = parseUseCase(blocks, index)
      if (useCase) {
        structured.push(useCase._value)
        index = useCase.end
        continue
      }

      structured.push(block)
    }

    return normalizeArticleFlow(structured)
  }

  function normalizeArticleFlow(blocks) {
    const normalized = []
    let currentSection = null

    const flushSection = () => {
      if (!currentSection) return
      if (currentSection.header || currentSection.paragraphs.length) {
        normalized.push(currentSection)
      }
      currentSection = null
    }

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index]

      if (block?._type === 'articleSection' || block?._type === 'articleList') {
        flushSection()
        normalized.push(block)
        continue
      }

      if (isLegacyCallout(block)) {
        flushSection()
        normalized.push(toCallout(block, index))
        continue
      }

      if (isHeading(block, 2) || isHeading(block, 3)) {
        flushSection()
        currentSection = {
          _type: 'articleSection',
          _key: `section-${block._key || index}`,
          header: blockText(block),
          headerLevel: block.style,
          paragraphs: [],
        }
        continue
      }

      if (block?._type === 'block' && block.listItem) {
        const carriedHeader =
          currentSection && currentSection.header && currentSection.paragraphs.length === 0
            ? {header: currentSection.header, headerLevel: currentSection.headerLevel}
            : null
        flushSection()

        const items = []
        const style = block.listItem
        let cursor = index
        while (
          cursor < blocks.length &&
          blocks[cursor]?._type === 'block' &&
          blocks[cursor].listItem === style
        ) {
          items.push({
            _type: 'articleListItem',
            _key: `list-item-${blocks[cursor]._key || cursor}`,
            text: [cloneInlineBlock(blocks[cursor], `list-item-${index}-${items.length}`)],
          })
          cursor += 1
        }

        normalized.push({
          _type: 'articleList',
          _key: `list-${block._key || index}`,
          ...(carriedHeader || {}),
          style,
          items,
        })
        index = cursor - 1
        continue
      }

      if (block?._type === 'block' && (block.style || 'normal') === 'normal') {
        if (!currentSection) {
          currentSection = {
            _type: 'articleSection',
            _key: `section-${block._key || index}`,
            paragraphs: [],
          }
        }
        currentSection.paragraphs.push(cloneParagraphBlock(block, `section-${index}`))
        continue
      }

      flushSection()
      normalized.push(block)
    }

    flushSection()
    return normalizeStructuredBlocks(
      splitMalformedStructuredLists(collapseStructuredPairs(normalized)),
    )
  }

  function parseInsightList(blocks, start) {
    const block = blocks[start]
    const text = blockText(block)
    const isWhatYouNeedToKnow =
      block?._type === 'block' &&
      (/^What You Need to Know(?: About .+)?\s*:$/i.test(text) ||
        (isHeading(block) && /^What You Need to Know(?: About .+)?$/i.test(text)))
    const isLegacyInsightHeading = isHeading(block) && /^(Core Insights|Answer Box)$/i.test(text)

    if (!isWhatYouNeedToKnow && !isLegacyInsightHeading) {
      return null
    }

    const items = []
    let cursor = start + 1
    while (cursor < blocks.length && blocks[cursor].listItem) {
      items.push({
        _type: 'insightItem',
        _key: `insight-${start}-${items.length}`,
        text: [cloneInlineBlock(blocks[cursor], `insight-${start}-${items.length}`)],
      })
      cursor += 1
    }

    if (!items.length) {
      return null
    }

    return {
      _value: {
        _type: 'insightList',
        _key: `insights-${start}`,
        heading: text.replace(/:\s*$/, ''),
        items,
      },
      end: cursor - 1,
    }
  }

  function parseFaq(blocks, start) {
    const items = []
    let cursor = start + 1

    while (cursor < blocks.length && !isHeading(blocks[cursor], 2)) {
      if (!isHeading(blocks[cursor], 3) || !blockText(blocks[cursor]).endsWith('?')) return null
      const question = blockText(blocks[cursor])
      const answer = []
      cursor += 1
      while (
        cursor < blocks.length &&
        !isHeading(blocks[cursor], 3) &&
        !isHeading(blocks[cursor], 2)
      ) {
        answer.push(cloneBlock(blocks[cursor], `faq-${start}-${items.length}-${answer.length}`))
        cursor += 1
      }
      if (!answer.length) return null
      items.push({question, answer})
    }

    return items.length
      ? {
          _value: {_type: 'faq', _key: `faq-${start}`, heading: blockText(blocks[start]), items},
          end: cursor - 1,
        }
      : null
  }

  function parseSources(blocks, start) {
    const items = []
    let cursor = start + 1
    while (cursor < blocks.length && blocks[cursor].listItem) {
      const block = blocks[cursor]
      const href = block.markDefs?.find((mark) => mark._type === 'link')?.href
      items.push({
        _key: `source-${start}-${items.length}`,
        _type: 'source',
        title: blockText(block),
        ...(href ? {url: href} : {}),
      })
      cursor += 1
    }
    return items.length
      ? {
          _value: {
            _type: 'sources',
            _key: `sources-${start}`,
            heading: blockText(blocks[start]),
            items,
          },
          end: cursor - 1,
        }
      : null
  }

  function parseFramework(blocks, start) {
    if (
      !isHeading(blocks[start], 2) ||
      !/^Stage (One|Two|Three|Four|Five|Six):/i.test(blockText(blocks[start]))
    ) {
      return null
    }

    const stages = []
    let cursor = start
    while (cursor < blocks.length) {
      const heading = blocks[cursor]
      const match =
        isHeading(heading, 2) &&
        blockText(heading).match(/^Stage (One|Two|Three|Four|Five|Six):\s*(.+)$/i)
      if (!match) break

      const explanation = []
      cursor += 1
      while (cursor < blocks.length && !isHeading(blocks[cursor], 2)) {
        const normalized = toConstrainedBlock(
          blocks[cursor],
          `framework-${start}-${stages.length}-${explanation.length}`,
        )
        if (!normalized) return null
        explanation.push(normalized)
        cursor += 1
      }
      if (!explanation.length) return null

      stages.push({
        _type: 'frameworkStep',
        _key: `framework-step-${start}-${stages.length}`,
        number: stages.length + 1,
        title: match[2],
        explanation,
      })
    }

    return stages.length >= 3
      ? {
          _value: {
            _type: 'framework',
            _key: `framework-${start}`,
            heading: blockText(blocks[start]).split(':')[0],
            steps: stages,
          },
          end: cursor - 1,
        }
      : null
  }

  function parseVendorProfile(blocks, start) {
    if (!isHeading(blocks[start], 3)) return null
    const name = blockText(blocks[start])
    if (
      !/Planning Center|Church Community Builder|Subsplash|Breeze ChMS|Elvanto|Rock RMS|Pushpay/i.test(
        name,
      )
    ) {
      return null
    }

    const segment = []
    let cursor = start + 1
    while (cursor < blocks.length && !isHeading(blocks[cursor])) {
      segment.push(blocks[cursor])
      cursor += 1
    }

    const labeled = new Map()
    let currentLabel
    for (const block of segment) {
      const text = blockText(block)
      const match = text.match(
        /^(Official Site|Free Trial|Documentation|Support|Download|Community|Contact|Market position|Best for|Core strengths|Limitations|Pricing|When to Choose[^:]*):\s*(.*)$/i,
      )
      if (match) {
        currentLabel = match[1].toLowerCase()
        labeled.set(currentLabel, [])
        if (match[2]) labeled.get(currentLabel).push(match[2])
        continue
      }
      if (currentLabel && (block.listItem || !isHeading(block))) {
        labeled.get(currentLabel).push(text)
      }
    }

    const required = ['market position', 'best for', 'core strengths', 'limitations', 'pricing']
    if (!required.every((key) => labeled.has(key))) return null

    const officialLinks = segment.flatMap((block) =>
      (block.markDefs || [])
        .filter((mark) => mark._type === 'link')
        .map((mark) => ({
          _key: `vendor-link-${start}-${mark._key}`,
          _type: 'officialLink',
          label: blockText(block),
          url: mark.href,
        })),
    )

    return {
      _value: {
        _type: 'vendorProfile',
        _key: `vendor-${start}`,
        name,
        officialLinks,
        marketPosition: labeled.get('market position').join(' '),
        bestFor: labeled.get('best for').join(' '),
        coreStrengths: labeled.get('core strengths'),
        limitations: labeled.get('limitations'),
        pricing: labeled.get('pricing').join(' '),
        selectionCriteria: labeled.get('when to choose') || [],
      },
      end: cursor - 1,
    }
  }

  function parseUseCase(blocks, start) {
    if (!isHeading(blocks[start], 3) || !/^Use Case \d+:/i.test(blockText(blocks[start])))
      return null
    return null
  }

  function isHeading(block, level) {
    return block?._type === 'block' && (!level || block.style === `h${level}`)
  }

  function isLegacyCallout(block) {
    return block?._type === 'block' && /^(Key Point|Key Insight)\s*:/i.test(blockText(block))
  }

  function blockText(block) {
    return (block?.children || [])
      .map((child) => child.text || '')
      .join('')
      .trim()
  }

  function cloneBlock(block, prefix) {
    return {
      ...block,
      _key: `${prefix}-${block._key || 'block'}`,
      children: (block.children || []).map((child, index) => ({
        ...child,
        _key: `${prefix}-span-${index}`,
      })),
    }
  }

  function cloneInlineBlock(block, prefix) {
    const cloned = cloneBlock(block, prefix)
    delete cloned.listItem
    delete cloned.level
    cloned.style = 'normal'
    return cloned
  }

  function cloneParagraphBlock(block, prefix) {
    const cloned = cloneBlock(block, prefix)
    delete cloned.listItem
    delete cloned.level
    cloned.style = 'normal'
    return cloned
  }

  function toConstrainedBlock(block, prefix) {
    if (
      block?._type !== 'block' ||
      !['normal', 'bullet', 'number'].includes(block.style || 'normal')
    ) {
      return null
    }
    return cloneBlock(block, prefix)
  }

  function stripBlockPrefix(block, prefix, keyPrefix) {
    const cloned = cloneBlock(block, keyPrefix)
    const first = cloned.children?.[0]
    if (first) first.text = first.text.replace(prefix, '')
    cloned.style = 'normal'
    return cloned
  }

  function toCallout(block, index) {
    const text = blockText(block)
    const match = text.match(/^(Key Point|Key Insight)\s*:\s*/i)
    return {
      _type: 'callout',
      _key: `callout-${block._key || index}`,
      label: match[1].replace('point', 'Point').replace('insight', 'Insight'),
      text: [stripBlockPrefix(block, match[0], `callout-${index}`)],
    }
  }

  function collapseStructuredPairs(blocks) {
    const collapsed = []

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index]
      const next = blocks[index + 1]

      if (isInsightSection(block) && next?._type === 'articleList') {
        collapsed.push({
          _type: 'insightList',
          _key: `insights-${block._key || index}`,
          heading: normalizeInsightHeading(getSectionLabel(block)),
          items: next.items.map((item, itemIndex) => ({
            _type: 'insightItem',
            _key: item._key || `insight-item-${index}-${itemIndex}`,
            text: item.text,
          })),
        })
        index += 1
        continue
      }

      collapsed.push(block)
    }

    return collapsed
  }

  function isInsightSection(block) {
    const label = getSectionLabel(block)
    return /^(What You Need to Know(?: About .+)?:?|Core Insights:?|Answer Box:?|Core Insights:\s+What You Need to Know.+)$/i.test(label)
  }

  function getSectionLabel(block) {
    if (block?._type === 'articleSection') {
      if (block.header) return block.header
      if (block.paragraphs?.length === 1) {
        return (block.paragraphs[0].children || []).map((child) => child.text || '').join('').trim()
      }
    }
    return ''
  }

  function normalizeInsightHeading(label) {
    return label.replace(/^Core Insights:\s*/i, '').replace(/:\s*$/, '')
  }

  function splitMalformedStructuredLists(blocks) {
    const output = []

    for (const block of blocks) {
      if (block?._type !== 'articleList') {
        output.push(block)
        continue
      }

      let currentItems = []
      let segmentIndex = 0

      const flushList = () => {
        if (!currentItems.length) return
        output.push({
          ...block,
          _key: segmentIndex === 0 ? block._key : `${block._key}-part-${segmentIndex}`,
          items: currentItems,
        })
        currentItems = []
        segmentIndex += 1
      }

      for (const item of block.items || []) {
        const split = splitInlineTextAtFirstNewline(item.text || [])
        if (!split) {
          currentItems.push(item)
          continue
        }

        currentItems.push({
          ...item,
          text: split.before,
        })
        flushList()
        output.push(...createBlocksFromSpill(split.after, block._key, segmentIndex))
      }

      flushList()
    }

    return output
  }

  function normalizeStructuredBlocks(blocks) {
    const normalized = []

    for (const block of blocks) {
      if (block?._type !== 'articleSection') {
        normalized.push(block)
        continue
      }

      normalized.push(...normalizeArticleSection(block))
    }

    return mergeAdjacentArticleLists(convertStructuredFaqSections(normalized))
  }

  function normalizeArticleSection(block) {
    const paragraphs = (block.paragraphs || [])
      .flatMap((paragraph, index) =>
        splitParagraphBlockByNewline(paragraph, `${block._key || 'section'}-paragraph-${index}`),
      )
      .filter((paragraph) => !isDiscardableStructuredParagraph(blockText(paragraph)))

    const normalized = {
      ...block,
      paragraphs,
    }

    if (!normalized.header && normalized.paragraphs.length >= 2) {
      const leadText = blockText(normalized.paragraphs[0])
      if (canPromoteLeadParagraphToHeader(leadText)) {
        normalized.header = leadText.replace(/:\s*$/, '')
        normalized.headerLevel = normalized.headerLevel || 'h3'
        normalized.paragraphs = normalized.paragraphs.slice(1)
      }
    }

    if (!normalized.header && normalized.paragraphs.length === 0) {
      return []
    }

    return [normalized]
  }

  function splitParagraphBlockByNewline(block, keyPrefix) {
    const base = structuredClone(block)
    const segments = [[]]
    let segmentIndex = 0
    let spanIndex = 0

    for (const child of block.children || []) {
      const parts = String(child.text || '').split('\n')

      for (let index = 0; index < parts.length; index += 1) {
        const part = parts[index]
        if (part) {
          segments[segmentIndex].push({
            ...child,
            _key: `${keyPrefix}-span-${spanIndex}`,
            text: part,
          })
          spanIndex += 1
        }

        if (index < parts.length - 1) {
          segmentIndex += 1
          segments[segmentIndex] = []
        }
      }
    }

    return segments
      .filter((children) => children.some((child) => (child.text || '').trim()))
      .map((children, index) => ({
        ...base,
        _key: `${keyPrefix}-${index}`,
        children,
      }))
  }

  function isDiscardableStructuredParagraph(text) {
    return (
      /^PlatformBest ForStarting PriceChurch Size RangeTop Strength/i.test(text) ||
      /^ModulePriceKey Features/i.test(text) ||
      /^Feature CategoryCapabilities/i.test(text)
    )
  }

  function canPromoteLeadParagraphToHeader(text) {
    if (!text) return false
    if (text.endsWith('?')) return true
    if (/[:.!]/.test(text)) return false
    return text.split(/\s+/).filter(Boolean).length <= 6
  }

  function convertStructuredFaqSections(blocks) {
    const normalized = []

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index]

      if (block?._type !== 'articleSection' || !/^Frequently Asked Questions$/i.test(block.header || '')) {
        normalized.push(block)
        continue
      }

      const inlineItems = parseInlineFaqItems(block)
      if (inlineItems.length) {
        normalized.push({
          _type: 'faq',
          _key: `faq-${block._key || index}`,
          heading: block.header,
          items: inlineItems,
        })
        continue
      }

      const items = []
      let cursor = index + 1

      while (cursor < blocks.length) {
        const candidate = blocks[cursor]
        if (candidate?._type !== 'articleSection' || !candidate.header?.endsWith('?')) {
          break
        }

        items.push({
          question: candidate.header,
          answer: candidate.paragraphs || [],
        })
        cursor += 1
      }

      if (!items.length) {
        normalized.push(block)
        continue
      }

      normalized.push({
        _type: 'faq',
        _key: `faq-${block._key || index}`,
        heading: block.header,
        items,
      })
      index = cursor - 1
    }

    return normalized
  }

  function parseInlineFaqItems(block) {
    const paragraphs = block.paragraphs || []
    if (!paragraphs.length || paragraphs.length % 2 !== 0) return []

    const items = []

    for (let index = 0; index < paragraphs.length; index += 2) {
      const question = blockText(paragraphs[index])
      const answer = paragraphs[index + 1]

      if (!question.endsWith('?') || !answer) {
        return []
      }

      items.push({
        question,
        answer: [answer],
      })
    }

    return items
  }

  function mergeAdjacentArticleLists(blocks) {
    const merged = []

    for (const block of blocks) {
      const previous = merged[merged.length - 1]

      if (
        block?._type === 'articleList' &&
        previous?._type === 'articleList' &&
        previous.style === block.style &&
        (previous.header || '') === (block.header || '') &&
        (previous.headerLevel || '') === (block.headerLevel || '')
      ) {
        previous.items = [...(previous.items || []), ...(block.items || [])]
        continue
      }

      merged.push(block)
    }

    return merged
  }

  function splitInlineTextAtFirstNewline(blocks) {
    let found = false
    const before = []
    const after = []

    for (const block of blocks || []) {
      const beforeChildren = []
      const afterChildren = []
      let blockSplit = found

      for (const child of block.children || []) {
        const text = child.text || ''

        if (blockSplit) {
          afterChildren.push({...child})
          continue
        }

        const newlineIndex = text.indexOf('\n')
        if (newlineIndex === -1) {
          beforeChildren.push({...child})
          continue
        }

        found = true
        blockSplit = true
        const beforeText = text.slice(0, newlineIndex)
        const afterText = text.slice(newlineIndex + 1)

        if (beforeText) beforeChildren.push({...child, text: beforeText})
        if (afterText) afterChildren.push({...child, text: afterText})
      }

      if (beforeChildren.length) {
        before.push({...block, children: beforeChildren})
      }

      if (afterChildren.length) {
        after.push({...block, children: afterChildren})
      }
    }

    if (!found) return null

    return {
      before: normalizeInlineText(before),
      after: normalizeInlineText(after),
    }
  }

  function normalizeInlineText(blocks) {
    return (blocks || [])
      .map((block) => ({
        ...block,
        children: (block.children || []).filter((child) => child.text),
      }))
      .filter((block) => block.children.length > 0)
  }

  function createBlocksFromSpill(inlineText, keySeed, segmentIndex) {
    const text = inlineTextToPlainText(inlineText)

    if (!text) return []

    if (/^(Key Point|Key Insight)\s*:/i.test(text)) {
      return [
        {
          _type: 'callout',
          _key: `${keySeed}-spill-callout-${segmentIndex}`,
          label: text.startsWith('Key Insight') ? 'Key Insight' : 'Key Point',
          text: [stripInlinePrefix(inlineText, /^(Key Point|Key Insight)\s*:\s*/i)],
        },
      ]
    }

    if (isHeadingLikeSpill(text)) {
      return [
        {
          _type: 'articleSection',
          _key: `${keySeed}-spill-heading-${segmentIndex}`,
          header: text.replace(/:\s*$/, ''),
          headerLevel: 'h3',
          paragraphs: [],
        },
      ]
    }

    return [
      {
        _type: 'articleSection',
        _key: `${keySeed}-spill-section-${segmentIndex}`,
        paragraphs: [inlineText],
      },
    ]
  }

  function inlineTextToPlainText(blocks) {
    return (blocks || [])
      .flatMap((block) => (block.children || []).map((child) => child.text || ''))
      .join('')
      .trim()
  }

  function stripInlinePrefix(blocks, prefix) {
    const cloned = structuredClone(blocks)
    const first = cloned[0]?.children?.[0]
    if (first) {
      first.text = first.text.replace(prefix, '')
    }
    return normalizeInlineText(cloned)
  }

  function isHeadingLikeSpill(text) {
    if (/^\d+\.\s/.test(text)) return true
    if (/^[^.!?]{1,120}:$/.test(text)) return true
    const wordCount = text.split(/\s+/).filter(Boolean).length
    return wordCount <= 8 && !/[.!?]/.test(text)
  }

  if (dryRun) {
    console.log(JSON.stringify({document, bodyBlocks: body.length, sourcePath}, null, 2))
  } else {
    const result = await client.createOrReplace(document)
    console.log(`Created ${result._id} with ${body.length} Portable Text blocks`)
  }
}

function toIsoDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Invalid published date: ${value}`)
  }
  return date.toISOString()
}

function htmlToPortableText(html) {
  if (looksLikeHtmlFragment(html)) {
    return htmlFragmentToPortableText(html)
  }

  const tokens = marked.lexer(html, {breaks: true})
  const blocks = []
  let blockIndex = 0
  let keyIndex = 0

  for (const token of tokens) {
    appendBlockToken(token, 1)
  }

  return blocks

  function appendBlockToken(token, listLevel) {
    if (!token || token.type === 'space') return

    if (token.type === 'list') {
      appendList(token, token.ordered ? 'number' : 'bullet', listLevel)
      return
    }

    if (token.type === 'blockquote') {
      for (const child of token.tokens || []) {
        appendBlockToken(child, listLevel)
      }
      return
    }

    if (token.type === 'hr') {
      blocks.push({_type: 'divider', _key: key('divider'), style: 'solid'})
      return
    }

    if (token.type === 'heading') {
      const style = token.depth <= 2 ? 'h2' : 'h3'
      addBlock(style, token.tokens || [])
      return
    }

    if (token.type === 'paragraph' || token.type === 'text') {
      addBlock('normal', token.tokens || [{type: 'text', text: token.text || token.raw || ''}])
    }
  }

  function appendList(listToken, listItem, level) {
    for (const item of listToken.items || []) {
      const inlineTokens = []

      for (const childToken of item.tokens || []) {
        if (childToken.type === 'list') continue

        if (childToken.type === 'text' && Array.isArray(childToken.tokens)) {
          inlineTokens.push(...childToken.tokens)
          continue
        }

        inlineTokens.push(childToken)
      }

      addBlock('normal', inlineTokens, {listItem, level})

      for (const childToken of item.tokens || []) {
        if (childToken.type === 'list') {
          appendList(childToken, childToken.ordered ? 'number' : 'bullet', level + 1)
        }
      }
    }
  }

  function addBlock(style, inlineTokens, list) {
    const markDefs = []
    const children = []
    appendInlineTokens(inlineTokens, [], children, markDefs)

    if (!children.length || children.every((child) => !child.text.trim())) return

    blocks.push({
      _type: 'block',
      _key: key(`block-${blockIndex++}`),
      style,
      ...(list || {}),
      markDefs,
      children,
    })
  }

  function appendInlineTokens(tokens, marks, children, markDefs) {
    for (const token of tokens || []) {
      if (!token) continue

      if (token.type === 'text' || token.type === 'escape') {
        addSpan(token.text || '', marks, children)
        continue
      }

      if (token.type === 'br' || (token.type === 'html' && /^<br\s*\/?>$/i.test(token.raw || token.text || ''))) {
        addSpan('\n', marks, children)
        continue
      }

      let nextMarks = marks
      if (token.type === 'strong') nextMarks = [...nextMarks, 'strong']
      if (token.type === 'em') nextMarks = [...nextMarks, 'em']
      if (token.type === 'link') {
        const href = token.href || ''
        if (/^(https?:|mailto:|\/)/i.test(href)) {
          const annotationKey = key(`link-${markDefs.length}`)
          markDefs.push({
            _key: annotationKey,
            _type: 'link',
            href,
            openInNewTab: false,
          })
          nextMarks = [...nextMarks, annotationKey]
        }
      }

      if (Array.isArray(token.tokens)) {
        appendInlineTokens(token.tokens, nextMarks, children, markDefs)
        continue
      }

      if (token.text) {
        addSpan(token.text, nextMarks, children)
      }
    }
  }

  function addSpan(text, marks, children) {
    if (!text) return
    const previous = children.at(-1)
    if (previous && JSON.stringify(previous.marks) === JSON.stringify(marks)) {
      previous.text += text
      return
    }
    children.push({_type: 'span', _key: key(`span-${children.length}`), text, marks})
  }

  function key(prefix) {
    return `${prefix}-${keyIndex++}`
  }
}

function htmlFragmentToPortableText(html) {
  const {document} = parseHTML(html)
  const blocks = []
  let blockIndex = 0
  let keyIndex = 0

  for (const node of document.childNodes || []) {
    appendNode(node, 1)
  }

  return blocks

  function appendNode(node, listLevel) {
    if (node.nodeType === 3) {
      if ((node.textContent || '').trim()) {
        addBlock('normal', node)
      }
      return
    }

    if (node.nodeType !== 1) return

    const tag = node.tagName.toLowerCase()
    if (tag === 'ul' || tag === 'ol') {
      appendList(node, tag === 'ol' ? 'number' : 'bullet', listLevel)
      return
    }

    if (tag === 'hr') {
      blocks.push({_type: 'divider', _key: key('divider'), style: 'solid'})
      return
    }

    const style =
      tag === 'h1' ? 'h2' : tag === 'h2' || tag === 'h3' || tag === 'blockquote' ? tag : 'normal'
    addBlock(style, node)
  }

  function appendList(list, listItem, level) {
    for (const child of list.children) {
      if (child.tagName.toLowerCase() !== 'li') continue

      addBlock('normal', child, {listItem, level})
      for (const nested of child.children) {
        const nestedTag = nested.tagName.toLowerCase()
        if (nestedTag === 'ul' || nestedTag === 'ol') {
          appendList(nested, nestedTag === 'ol' ? 'number' : 'bullet', level + 1)
        }
      }
    }
  }

  function addBlock(style, node, list) {
    const markDefs = []
    const children = []
    appendInline(node, [], children, markDefs)

    if (!children.length || children.every((child) => !child.text.trim())) return

    blocks.push({
      _type: 'block',
      _key: key(`block-${blockIndex++}`),
      style,
      ...(list || {}),
      markDefs,
      children,
    })
  }

  function appendInline(node, marks, children, markDefs) {
    for (const child of node.childNodes || []) {
      if (child.nodeType === 3) {
        addSpan(child.textContent || '', marks, children)
        continue
      }

      if (child.nodeType !== 1) continue

      const tag = child.tagName.toLowerCase()
      if (tag === 'ul' || tag === 'ol') continue
      if (tag === 'br') {
        addSpan('\n', marks, children)
        continue
      }

      let nextMarks = marks
      if (tag === 'strong' || tag === 'b') nextMarks = [...nextMarks, 'strong']
      if (tag === 'em' || tag === 'i') nextMarks = [...nextMarks, 'em']
      if (tag === 'a') {
        const href = child.getAttribute('href') || ''
        if (/^(https?:|mailto:|\/)/i.test(href)) {
          const annotationKey = key(`link-${markDefs.length}`)
          markDefs.push({
            _key: annotationKey,
            _type: 'link',
            href,
            openInNewTab: child.getAttribute('target') === '_blank',
          })
          nextMarks = [...nextMarks, annotationKey]
        }
      }

      appendInline(child, nextMarks, children, markDefs)
    }
  }

  function addSpan(text, marks, children) {
    if (!text) return
    const previous = children.at(-1)
    if (previous && JSON.stringify(previous.marks) === JSON.stringify(marks)) {
      previous.text += text
      return
    }
    children.push({_type: 'span', _key: key(`span-${children.length}`), text, marks})
  }

  function key(prefix) {
    return `${prefix}-${keyIndex++}`
  }
}

function looksLikeHtmlFragment(source) {
  return /^\s*</.test(source)
}

function resolveSourcePath(sourcePath) {
  if (path.isAbsolute(sourcePath)) return sourcePath

  const candidates = [
    path.resolve(process.cwd(), sourcePath),
    path.resolve(workspaceRoot, sourcePath),
    path.resolve(studioRoot, sourcePath),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[1]
}
