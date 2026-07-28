import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const projectId = '8yy9mp89'
const dataset = 'production'
const apiVersion = '2025-02-19'
const dryRun = process.argv.includes('--dry-run')

const tokenPath = path.join(os.homedir(), '.config', 'sanity', 'config.json')
const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8')).authToken

if (!token) {
  throw new Error(`Missing authToken in ${tokenPath}`)
}

const apiBase = `https://${projectId}.api.sanity.io/v${apiVersion}/data`
const query = '*[_type == "blogPost"]{_id,_rev,title,"slug":slug.current,body}'
const response = await fetchJson(
  `${apiBase}/query/${dataset}?${new URLSearchParams({query}).toString()}`,
)

const docs = response.result || []
const changed = []
const warnings = []

for (const doc of docs) {
  const body = Array.isArray(doc.body) ? doc.body : []
  const result = normalizeBody(body, doc.slug)
  const normalizedBody = result.body

  if (result.warnings.length) {
    warnings.push(...result.warnings)
  }

  if (JSON.stringify(normalizedBody) === JSON.stringify(body)) {
    continue
  }

  changed.push(doc.slug)

  if (dryRun) {
    continue
  }

  await fetchJson(`${apiBase}/mutate/${dataset}?returnIds=true`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      mutations: [
        {
          patch: {
            id: doc._id,
            ifRevisionID: doc._rev,
            set: {
              body: normalizedBody,
            },
          },
        },
      ],
    }),
  })
}

console.log(
  JSON.stringify(
    {
      dryRun,
      total: docs.length,
      changedCount: changed.length,
      changed,
      warnings,
    },
    null,
    2,
  ),
)

function normalizeBody(body, slug) {
  const normalized = []
  const localWarnings = []
  let currentSection = null

  const flushSection = () => {
    if (!currentSection) return

    if (currentSection.header || currentSection.paragraphs.length) {
      normalized.push(currentSection)
    }

    currentSection = null
  }

  for (let index = 0; index < body.length; index += 1) {
    const block = body[index]

    if (block?._type === 'articleSection' || block?._type === 'articleList') {
      flushSection()
      normalized.push(block)
      continue
    }

    if (isLegacyInsightHeading(block)) {
      flushSection()
      const items = []
      let cursor = index + 1

      while (isListBlock(body[cursor])) {
        items.push({
          _type: 'insightItem',
          _key: `insight-${block._key || index}-${items.length}`,
          text: [cloneInlineBlock(body[cursor])],
        })
        cursor += 1
      }

      if (items.length) {
        normalized.push({
          _type: 'insightList',
          _key: `insights-${block._key || index}`,
          heading: blockText(block).replace(/:\s*$/, ''),
          items,
        })
        index = cursor - 1
        continue
      }
    }

    if (isLegacyTocHeading(block)) {
      flushSection()
      let cursor = index + 1

      while (isListBlock(body[cursor])) {
        cursor += 1
      }

      if (isBogusTocTakeaways(body[cursor])) {
        cursor += 1
      }

      normalized.push({
        _type: 'tableOfContents',
        _key: `toc-${block._key || index}`,
        title: blockText(block) || 'Table of Contents',
      })
      index = cursor - 1
      continue
    }

    if (isBogusTocTakeaways(block)) {
      continue
    }

    if (isLegacyCallout(block)) {
      flushSection()
      normalized.push(toCallout(block, index))
      continue
    }

    if (isHeadingBlock(block)) {
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

    if (isListBlock(block)) {
      const carriedHeader =
        currentSection && currentSection.header && currentSection.paragraphs.length === 0
          ? {header: currentSection.header, headerLevel: currentSection.headerLevel}
          : null
      flushSection()

      const items = []
      const style = block.listItem
      let cursor = index
      while (cursor < body.length && isListBlock(body[cursor]) && body[cursor].listItem === style) {
        items.push({
          _type: 'articleListItem',
          _key: `list-item-${body[cursor]._key || cursor}`,
          text: [cloneInlineBlock(body[cursor])],
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

    if (isParagraphBlock(block)) {
      if (!currentSection) {
        currentSection = {
          _type: 'articleSection',
          _key: `section-${block._key || index}`,
          paragraphs: [],
        }
      }

      currentSection.paragraphs.push(cloneParagraphBlock(block))
      continue
    }

    flushSection()
    normalized.push(block)
  }

  flushSection()

  return {
    body: normalizeStructuredBlocks(splitMalformedStructuredLists(collapseStructuredPairs(normalized))),
    warnings: localWarnings,
  }
}

function isLegacyInsightHeading(block) {
  if (block?._type !== 'block') return false
  const text = blockText(block)
  return (
    /^What You Need to Know(?: About .+)?:?$/i.test(text) ||
    /^(Core Insights|Answer Box)$/i.test(text)
  )
}

function isLegacyTocHeading(block) {
  return block?._type === 'block' && block.style === 'h2' && blockText(block) === 'Table of Contents'
}

function isLegacyCallout(block) {
  return (
    block?._type === 'block' &&
    /^(Key Point|Key Insight)\s*:/i.test(blockText(block))
  )
}

function isHeadingBlock(block) {
  return block?._type === 'block' && (block.style === 'h2' || block.style === 'h3')
}

function isListBlock(block) {
  return block?._type === 'block' && !!block.listItem
}

function isParagraphBlock(block) {
  return block?._type === 'block' && (block.style || 'normal') === 'normal' && !block.listItem
}

function isBogusTocTakeaways(block) {
  if (block?._type !== 'takeaways' || block.heading !== 'Key Takeaways' || block.items?.length !== 2) {
    return false
  }

  const itemTexts = block.items.map((item) =>
    (item.text || [])
      .flatMap((textBlock) => (textBlock.children || []).map((child) => child.text || ''))
      .join('')
      .trim(),
  )

  return itemTexts[0] === 'Sources and References' && itemTexts[1] === 'Where We Go From Here'
}

function cloneInlineBlock(block) {
  const cloned = structuredClone(block)
  delete cloned.listItem
  delete cloned.level
  cloned.style = 'normal'
  return cloned
}

function cloneParagraphBlock(block) {
  const cloned = structuredClone(block)
  delete cloned.listItem
  delete cloned.level
  cloned.style = 'normal'
  return cloned
}

function toCallout(block, index) {
  const text = blockText(block)
  const match = text.match(/^(Key Point|Key Insight)\s*:\s*/i)
  const cloned = cloneParagraphBlock(block)
  if (cloned.children?.[0]) {
    cloned.children[0].text = cloned.children[0].text.replace(match[0], '')
    cloned.children[0].marks = (cloned.children[0].marks || []).filter((mark) => mark !== 'strong')
  }
  return {
    _type: 'callout',
    _key: `callout-${block._key || index}`,
    label: match[1].replace('point', 'Point').replace('insight', 'Insight'),
    text: [cloned],
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

function blockText(block) {
  return (block?.children || [])
    .map((child) => child.text || '')
    .join('')
    .trim()
}

async function fetchJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}\n${await response.text()}`)
  }

  return response.json()
}
