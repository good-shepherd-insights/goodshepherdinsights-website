import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'
import matter from 'gray-matter'
import {parseHTML} from 'linkedom'
import {marked} from 'marked'

const studioRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(studioRoot, '..')
const sourceDirectory = path.join(workspaceRoot, 'src/content/services/english')
const tokenPath = path.join(os.homedir(), '.config', 'sanity', 'config.json')
const authToken = JSON.parse(fs.readFileSync(tokenPath, 'utf8')).authToken
const dryRun = process.argv.includes('--dry-run')
const uploadCache = new Map()

const client = createClient({
  projectId: '8yy9mp89',
  dataset: 'production',
  apiVersion: '2026-01-01',
  token: authToken,
  useCdn: false,
})

const sourceArgIndex = process.argv.indexOf('--source')
const sourceArgValue =
  sourceArgIndex >= 0 && process.argv[sourceArgIndex + 1] ? process.argv[sourceArgIndex + 1] : null

const sourcePaths = sourceArgValue
  ? [resolveSourcePath(sourceArgValue)]
  : fs
      .readdirSync(sourceDirectory)
      .filter((fileName) => fileName.endsWith('.mdx'))
      .sort()
      .map((fileName) => path.join(sourceDirectory, fileName))

for (const sourcePath of sourcePaths) {
  await migrate(sourcePath)
}

async function migrate(sourcePath) {
  const source = fs.readFileSync(sourcePath, 'utf8')
  const {data: frontmatter, content} = matter(source)
  const slug = frontmatter.customSlug || frontmatter.slug
  if (!slug) throw new Error(`Missing slug in ${sourcePath}`)

  const heroImage = frontmatter.image
    ? await toImageWithAlt(frontmatter.image, frontmatter.imageAlt || frontmatter.title)
    : undefined

  const body = await parseServiceBody(content, slug)
  const order = orderFromFileName(sourcePath)
  const document = {
    _id: `service-${slug}`,
    _type: 'service',
    title: frontmatter.title,
    slug: {_type: 'slug', current: slug},
    status: frontmatter.draft ? 'draft' : 'published',
    order,
    excerpt: frontmatter.description || frontmatter.metaDescription,
    serviceType: frontmatter.serviceType || 'Consulting Service',
    ...(heroImage ? {heroImage} : {}),
    body,
    seo: {
      _type: 'seoFields',
      metaTitle: frontmatter.metaTitle || frontmatter.title,
      metaDescription: frontmatter.metaDescription || frontmatter.description,
      keywords: frontmatter.keywords || [],
      canonical: frontmatter.canonical,
      robots: frontmatter.robots || 'index, follow',
      excludeFromSitemap: Boolean(frontmatter.excludeFromSitemap),
    },
  }

  if (dryRun) {
    console.log(
      `DRY service-${slug}: ${body.length} body blocks, ${body.filter((block) => block._type === 'serviceOffering').length} offerings`,
    )
    return
  }

  await client.createOrReplace(document)
  console.log(`Migrated service-${slug}: ${body.length} body blocks`)
}

async function parseServiceBody(content, slug) {
  const body = []
  const blockPattern =
    /<(ServiceIntro|SubServiceCard|CTASection)\b([^>]*)>([\s\S]*?)<\/\1>|<(StatCallout|ImageItem)\b([\s\S]*?)\/>/g
  let lastIndex = 0
  let match
  let blockIndex = 0

  while ((match = blockPattern.exec(content))) {
    pushNarratives(body, content.slice(lastIndex, match.index), slug, blockIndex)
    blockIndex += 1

    const pairedName = match[1]
    const pairedAttrs = match[2] || ''
    const pairedInner = match[3] || ''
    const selfClosingName = match[4]
    const selfClosingAttrs = match[5] || ''
    const key = `${slug}-${blockIndex}`

    if (pairedName === 'ServiceIntro') {
      const attrs = parseAttrs(pairedAttrs)
      body.push({
        _type: 'serviceIntro',
        _key: key,
        ...(attrs.title ? {title: attrs.title} : {}),
        text: markdownToPortableText(pairedInner, `${key}-intro`),
      })
    }

    if (pairedName === 'SubServiceCard') {
      body.push(parseOffering(pairedAttrs, pairedInner, key))
    }

    if (pairedName === 'CTASection') {
      const attrs = parseAttrs(pairedAttrs)
      body.push({
        _type: 'serviceCta',
        _key: key,
        title: attrs.title,
        href: attrs.href,
        linkText: attrs.linkText,
        text: markdownToPortableText(pairedInner, `${key}-cta`),
      })
    }

    if (selfClosingName === 'StatCallout') {
      body.push(parseStatCallout(selfClosingAttrs, key))
    }

    if (selfClosingName === 'ImageItem') {
      body.push(await parseServiceImage(selfClosingAttrs, key))
    }

    lastIndex = blockPattern.lastIndex
    blockIndex += 1
  }

  pushNarratives(body, content.slice(lastIndex), slug, blockIndex)
  return body.filter(Boolean)
}

function parseOffering(attrsSource, innerSource, key) {
  const attrs = parseAttrs(attrsSource)
  let descriptionSource = innerSource
  const audience = []
  const deliverables = []
  const methodologySteps = []
  const statCallouts = []
  let outcomesTitle
  const outcomes = []

  descriptionSource = descriptionSource.replace(
    /<PersonaCard\b([^>]*)\/>/g,
    (_match, attrsText) => {
      const parsed = parseAttrs(attrsText)
      audience.push(...(parsed.items || []))
      return ''
    },
  )

  descriptionSource = descriptionSource.replace(
    /<StatCallout\b([\s\S]*?)\/>/g,
    (_match, attrsText) => {
      statCallouts.push(parseStatCallout(attrsText, `${key}-stat-${statCallouts.length}`))
      return ''
    },
  )

  descriptionSource = descriptionSource.replace(
    /<DeliverablesList\b[^>]*>([\s\S]*?)<\/DeliverablesList>/g,
    (_match, listText) => {
      deliverables.push(...markdownToTextItems(listText, `${key}-deliverable`))
      return ''
    },
  )

  descriptionSource = descriptionSource.replace(
    /<MethodologySteps\b([^/>]*)\/>/g,
    (_match, attrsText) => {
      const parsed = parseAttrs(attrsText)
      methodologySteps.push(
        ...(parsed.steps || []).map((step, index) => toTextItem(step, `${key}-step-${index}`)),
      )
      return ''
    },
  )

  descriptionSource = descriptionSource.replace(
    /<MethodologySteps\b[^>]*>([\s\S]*?)<\/MethodologySteps>/g,
    (_match, listText) => {
      methodologySteps.push(...markdownToTextItems(listText, `${key}-step`))
      return ''
    },
  )

  descriptionSource = descriptionSource.replace(
    /<OutcomeBlock\b([^>]*)>([\s\S]*?)<\/OutcomeBlock>/g,
    (_match, attrsText, outcomeText) => {
      const parsed = parseAttrs(attrsText)
      outcomesTitle = parsed.title || outcomesTitle
      outcomes.push(...markdownToTextItems(outcomeText, `${key}-outcome`))
      return ''
    },
  )

  return {
    _type: 'serviceOffering',
    _key: key,
    number: attrs.number ? Number(attrs.number) : undefined,
    title: attrs.title,
    description: markdownToPortableText(descriptionSource, `${key}-description`),
    ...(audience.length ? {audience} : {}),
    ...(deliverables.length ? {deliverables} : {}),
    ...(methodologySteps.length ? {methodologySteps} : {}),
    ...(statCallouts.length ? {statCallouts} : {}),
    ...(outcomesTitle ? {outcomesTitle} : {}),
    ...(outcomes.length ? {outcomes} : {}),
  }
}

function pushNarratives(body, source, slug, index) {
  const narratives = markdownToNarratives(source, `${slug}-narrative-${index}`)
  body.push(...narratives)
}

function markdownToNarratives(source, keyPrefix) {
  const normalized = normalizeMarkdownForNarrative(source)
  if (!normalized.trim()) return []

  const narratives = []
  const headingPattern = /^##\s+(.+)$/gm
  let currentHeading
  let currentStart = 0
  let match
  let count = 0

  const flush = (end) => {
    const text = normalized.slice(currentStart, end).trim()
    if (!text) return
    narratives.push({
      _type: 'serviceNarrative',
      _key: `${keyPrefix}-${count}`,
      ...(currentHeading ? {heading: currentHeading} : {}),
      text: markdownToPortableText(text, `${keyPrefix}-${count}-text`),
    })
    count += 1
  }

  while ((match = headingPattern.exec(normalized))) {
    flush(match.index)
    currentHeading = cleanHeading(match[1])
    currentStart = headingPattern.lastIndex
  }

  flush(normalized.length)
  return narratives
}

function normalizeMarkdownForNarrative(source) {
  return source
    .replace(/<PersonaCard\b([^>]*)\/>/g, (_match, attrsText) => {
      const {items = []} = parseAttrs(attrsText)
      return items.map((item) => `- ${item}`).join('\n')
    })
    .replace(/<OutcomeBlock\b([^>]*)>([\s\S]*?)<\/OutcomeBlock>/g, (_match, attrsText, text) => {
      const {title = 'Outcomes'} = parseAttrs(attrsText)
      return `\n## ${title}\n${text}\n`
    })
    .replace(/\[\.h2[^\]]*\]/g, '')
    .trim()
}

function parseStatCallout(attrsSource, key) {
  const attrs = parseAttrs(attrsSource)
  return {
    _type: 'statCallout',
    _key: key,
    value: attrs.value,
    label: attrs.label,
    description: attrs.description,
  }
}

async function parseServiceImage(attrsSource, key) {
  const attrs = parseAttrs(attrsSource)
  const image = await toImageWithAlt(attrs.imageSrc, attrs.imageAlt || 'Service image')
  return {
    _type: 'serviceImage',
    _key: key,
    image,
    ...(attrs.videoSrc
      ? {
          video: {
            _type: 'object',
            src: attrs.videoSrc,
            provider: attrs.videoProvider || 'youtube',
            id: attrs.videoId,
          },
        }
      : {}),
  }
}

async function toImageWithAlt(imageSrc, alt) {
  const imagePath = resolveAssetPath(imageSrc)
  if (!imagePath || !fs.existsSync(imagePath)) {
    throw new Error(`Image does not exist: ${imageSrc}`)
  }

  if (dryRun) {
    return {
      _type: 'imageWithAlt',
      image: {
        _type: 'image',
        asset: {_type: 'reference', _ref: `dry-run-${path.basename(imagePath)}`},
      },
      alt,
    }
  }

  if (!uploadCache.has(imagePath)) {
    const asset = await client.assets.upload('image', fs.createReadStream(imagePath), {
      filename: path.basename(imagePath),
    })
    uploadCache.set(imagePath, asset._id)
  }

  return {
    _type: 'imageWithAlt',
    image: {
      _type: 'image',
      asset: {_type: 'reference', _ref: uploadCache.get(imagePath)},
    },
    alt,
  }
}

function markdownToTextItems(source, keyPrefix) {
  const lines = source
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const listItems = lines
    .map((line) => line.match(/^[-*]\s+(.+)$/)?.[1] || line.match(/^\d+\.\s+(.+)$/)?.[1])
    .filter(Boolean)

  if (listItems.length) {
    return listItems.map((item, index) => toTextItem(item, `${keyPrefix}-${index}`))
  }

  return source
    .trim()
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, index) => toTextItem(item, `${keyPrefix}-${index}`))
}

function toTextItem(source, key) {
  return {
    _type: 'object',
    _key: key,
    text: markdownToPortableText(source, `${key}-text`),
  }
}

function markdownToPortableText(source, keyPrefix) {
  const html = marked.parse(source.replace(/\[\.h2[^\]]*\]/g, '').trim())
  const {document} = parseHTML(`<body>${html}</body>`)
  const blocks = []
  let index = 0

  for (const node of Array.from(document.body.childNodes)) {
    blocks.push(...nodeToBlocks(node, `${keyPrefix}-${index}`))
    index += 1
  }

  return blocks.length ? blocks : [textBlock(source.trim(), `${keyPrefix}-fallback`)]
}

function nodeToBlocks(node, keyPrefix) {
  if (node.nodeType === 3) {
    const text = node.textContent.trim()
    return text ? [textBlock(text, keyPrefix)] : []
  }

  const tagName = node.tagName?.toLowerCase()
  if (!tagName) return []

  if (tagName === 'p') return [blockFromNode(node, keyPrefix, 'normal')]
  if (/^h[1-6]$/.test(tagName))
    return [blockFromNode(node, keyPrefix, tagName === 'h4' ? 'h4' : 'h3')]
  if (tagName === 'blockquote') return [blockFromNode(node, keyPrefix, 'blockquote')]

  if (tagName === 'ul' || tagName === 'ol') {
    return Array.from(node.children).map((item, index) => ({
      ...blockFromNode(item, `${keyPrefix}-item-${index}`, 'normal'),
      listItem: tagName === 'ol' ? 'number' : 'bullet',
      level: 1,
    }))
  }

  return Array.from(node.childNodes).flatMap((child, index) =>
    nodeToBlocks(child, `${keyPrefix}-${index}`),
  )
}

function blockFromNode(node, key, style) {
  const markDefs = []
  const spanCounter = {value: 0}
  const children = inlineChildren(node, key, [], markDefs, spanCounter).filter(
    (child) => child.text,
  )
  return {
    _type: 'block',
    _key: key,
    style,
    markDefs,
    children: children.length ? children : [{_type: 'span', _key: `${key}-span-empty`, text: ''}],
  }
}

function inlineChildren(node, keyPrefix, marks, markDefs, spanCounter) {
  if (node.nodeType === 3) {
    return [
      {
        _type: 'span',
        _key: `${keyPrefix}-span-${spanCounter.value++}`,
        text: node.textContent,
        ...(marks.length ? {marks} : {}),
      },
    ]
  }

  const tagName = node.tagName?.toLowerCase()
  if (tagName === 'br') {
    return [
      {
        _type: 'span',
        _key: `${keyPrefix}-span-${spanCounter.value++}`,
        text: '\n',
        ...(marks.length ? {marks} : {}),
      },
    ]
  }

  let nextMarks = marks
  if (tagName === 'strong' || tagName === 'b') nextMarks = [...marks, 'strong']
  if (tagName === 'em' || tagName === 'i') nextMarks = [...marks, 'em']
  if (tagName === 'a') {
    const linkKey = `${keyPrefix}-link-${markDefs.length}`
    markDefs.push({
      _type: 'link',
      _key: linkKey,
      href: node.getAttribute('href'),
      openInNewTab: true,
    })
    nextMarks = [...marks, linkKey]
  }

  return Array.from(node.childNodes).flatMap((child, index) =>
    inlineChildren(child, `${keyPrefix}-${index}`, nextMarks, markDefs, spanCounter),
  )
}

function textBlock(text, key) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: `${key}-span`, text}],
  }
}

function parseAttrs(source) {
  const attrs = {}
  const attrPattern = /([A-Za-z][\w-]*)=(?:"([^"]*)"|'([^']*)'|{([^}]*)})/g
  let match

  while ((match = attrPattern.exec(source))) {
    const [, key, doubleQuoted, singleQuoted, expression] = match
    const value = doubleQuoted ?? singleQuoted ?? expression
    attrs[key] = parseAttrValue(value)
  }

  return attrs
}

function parseAttrValue(value) {
  const trimmed = String(value).trim()
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    return JSON.parse(trimmed)
  }
  return trimmed
}

function cleanHeading(source) {
  return source
    .replace(/\[\.h2[^\]]*\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveAssetPath(assetPath) {
  if (!assetPath) return null
  const cleanPath = assetPath.replace(/^\//, '')
  const candidates = [
    path.join(workspaceRoot, 'src/assets', cleanPath),
    path.join(workspaceRoot, 'public', cleanPath),
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0]
}

function resolveSourcePath(sourceArg) {
  if (path.isAbsolute(sourceArg)) return sourceArg
  const directPath = path.resolve(workspaceRoot, sourceArg)
  if (fs.existsSync(directPath)) return directPath
  return path.join(sourceDirectory, sourceArg)
}

function orderFromFileName(sourcePath) {
  const match = path.basename(sourcePath).match(/service-(\d+)/)
  return match ? Number(match[1]) : undefined
}
