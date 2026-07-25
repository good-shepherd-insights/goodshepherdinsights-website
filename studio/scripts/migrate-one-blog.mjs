import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {JSDOM} from 'jsdom'
import yaml from 'js-yaml'
import {marked} from 'marked'
import {getCliClient} from 'sanity/cli'

const studioRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(studioRoot, '..')
const sourceDirectory = path.join(workspaceRoot, 'src/content/blog/english')
const defaultSourcePath = path.join(
  workspaceRoot,
  'src/content/blog/english/rolling-out-ai-in-church-management-software.mdx',
)
const dryRun = process.argv.includes('--dry-run')
const sourcePaths = process.argv.includes('--all')
  ? fs
      .readdirSync(sourceDirectory)
      .filter((fileName) => fileName.endsWith('.mdx'))
      .sort()
      .map((fileName) => path.join(sourceDirectory, fileName))
  : [defaultSourcePath]

for (const sourcePath of sourcePaths) {
  await migrate(sourcePath)
}

async function migrate(sourcePath) {
  const source = fs.readFileSync(sourcePath, 'utf8')
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)

  if (!match) {
    throw new Error(`Could not parse frontmatter in ${sourcePath}`)
  }

  const frontmatter = yaml.load(match[1])
  const bodySource = match[2]
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

  const client = getCliClient({apiVersion: '2026-01-01'})
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

      if (isHeading(block) && /^(Core Insights|Answer Box)$/i.test(text)) {
        const items = []
        let cursor = index + 1
        while (cursor < blocks.length && blocks[cursor].listItem) {
          items.push({
            _type: 'insightItem',
            _key: `insight-${index}-${items.length}`,
            text: [cloneInlineBlock(blocks[cursor], `insight-${index}-${items.length}`)],
          })
          cursor += 1
        }
        if (items.length) {
          structured.push({_type: 'insightList', _key: `insights-${index}`, heading: text, items})
          index = cursor - 1
          continue
        }
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

    return structured
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
    return cloned
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
  const renderedMarkdown = marked.parse(html, {breaks: true})
  const document = new JSDOM(`<body>${renderedMarkdown}</body>`).window.document
  const blocks = []
  let blockIndex = 0
  let keyIndex = 0

  for (const node of document.body.childNodes) {
    appendNode(node, 1)
  }

  return blocks

  function appendNode(node, listLevel) {
    if (node.nodeType === 3) {
      if (node.textContent.trim()) {
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
    const inlineRoot = list ? node : node
    appendInline(inlineRoot, [], children, markDefs)

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
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        addSpan(child.textContent, marks, children)
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
