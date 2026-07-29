import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'
import matter from 'gray-matter'

const studioRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspaceRoot = path.resolve(studioRoot, '..')
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

const homepage = readFrontmatter('src/content/homepage/english/-index.md')
const hero = readFrontmatter('src/content/sections/english/hero-section.md')
const services = readFrontmatter('src/content/sections/english/services-section.md')
const about = readFrontmatter('src/content/sections/english/about-section.md')
const blog = readFrontmatter('src/content/sections/english/blog-section.md')

const document = {
  _id: 'home-page',
  _type: 'homePage',
  title: homepage.title,
  pageType: homepage.pageType || 'home',
  disableTagline: homepage.disableTagline !== false,
  seo: {
    _type: 'seoFields',
    metaTitle: homepage.metaTitle || homepage.title,
    metaDescription: homepage.metaDescription,
    keywords: homepage.keywords || [],
    canonical: homepage.canonical,
    robots: homepage.robots || 'index, follow',
    excludeFromSitemap: Boolean(homepage.excludeFromSitemap),
  },
  heroSection: await toHeroSection(hero),
  servicesSection: await toServicesSection(services),
  aboutSection: await toAboutSection(about),
  blogSection: toBlogSection(blog),
}

if (dryRun) {
  console.log(JSON.stringify(document, null, 2))
} else {
  await client.createOrReplace(document)
  console.log('Migrated home-page')
}

function readFrontmatter(relativePath) {
  const sourcePath = path.join(workspaceRoot, relativePath)
  return matter(fs.readFileSync(sourcePath, 'utf8')).data
}

async function toHeroSection(source) {
  return {
    _type: 'homeHeroSection',
    enable: source.enable !== false,
    subTitle: source.subTitle,
    titleLine1: source.titleLine1,
    titleLine2: source.titleLine2,
    description: source.description,
    ...(source.arrowDecorationImage
      ? {
          arrowDecorationImage: await toImageWithAlt(
            source.arrowDecorationImage,
            source.arrowDecorationImageAlt,
          ),
        }
      : {}),
    ...(source.shapeImage
      ? {shapeImage: await toImageWithAlt(source.shapeImage, source.shapeImageAlt)}
      : {}),
    slides: await Promise.all(
      (source.slides || []).map(async (slide, index) => ({
        _key: `hero-slide-${index}`,
        _type: 'object',
        image: await toImageWithAlt(slide.image, slide.alt),
      })),
    ),
    satisfactionClients: source.satisfactionClients
      ? {
          _type: 'object',
          enable: source.satisfactionClients.enable === true,
          avatars: await Promise.all(
            (source.satisfactionClients.avatars || []).map((avatar, index) =>
              toImageWithAlt(avatar, source.satisfactionClients.avatarAlt, `avatar-${index}`),
            ),
          ),
          avatarAlt: source.satisfactionClients.avatarAlt,
          count: source.satisfactionClients.count,
          label: source.satisfactionClients.label,
        }
      : undefined,
    video: source.video
      ? {
          _type: 'object',
          src: source.video.src,
          type: source.video.type || '',
          provider: source.video.provider || 'youtube',
          ...(source.video.poster
            ? {
                poster: await toImageWithAlt(
                  source.video.poster,
                  source.video.posterAlt || 'Video poster',
                ),
              }
            : {}),
          autoplay: source.video.autoplay === true,
          id: source.video.id,
        }
      : undefined,
    helpDropdown: source.helpDropdown
      ? {
          _type: 'object',
          enable: source.helpDropdown.enable === true,
          label: source.helpDropdown.label,
          items: (source.helpDropdown.items || []).map((item, index) => ({
            _key: `help-${index}`,
            _type: 'object',
            label: item.label,
            url: item.url,
          })),
        }
      : undefined,
  }
}

async function toServicesSection(source) {
  return {
    _type: 'homeServicesSection',
    enable: source.enable !== false,
    badge: source.badge,
    title: source.title,
    description: source.description,
    ...(source.image ? {image: await toImageWithAlt(source.image, source.imageAlt)} : {}),
    button: source.button
      ? {
          _type: 'reusableButton',
          enable: source.button.enable !== false,
          label: source.button.label,
          url: source.button.url,
          variant: source.button.variant,
          hoverEffect: source.button.hoverEffect,
        }
      : undefined,
    cardLayout: source.cardLayout || 'horizontal',
    limit: source.limit,
  }
}

async function toAboutSection(source) {
  return {
    _type: 'homeAboutSection',
    enable: source.enable !== false,
    list: await Promise.all(
      (source.list || []).map(async (item, index) => ({
        _key: `about-${index}`,
        _type: 'object',
        enable: item.enable !== false,
        badge: item.badge,
        title: item.title,
        description: item.description,
        services: (item.services || []).map((service, serviceIndex) => ({
          _key: `about-${index}-service-${serviceIndex}`,
          _type: 'object',
          title: service.title,
          percent: service.percent,
        })),
        ...(item.image ? {image: await toImageWithAlt(item.image, item.imageAlt)} : {}),
        imageVerticalTitle: item.imageVerticalTitle,
        leftImagePostion: item.leftImagePostion === true,
      })),
    ),
  }
}

function toBlogSection(source) {
  return {
    _type: 'homeBlogSection',
    enable: source.enable !== false,
    badge: source.badge,
    title: source.title,
    options: {
      _type: 'object',
      layout: source.options?.layout || 'grid',
      limit: source.options?.limit,
    },
  }
}

async function toImageWithAlt(imageSrc, alt, key) {
  const imagePath = resolveAssetPath(imageSrc)
  if (!imagePath || !fs.existsSync(imagePath)) {
    throw new Error(`Image does not exist: ${imageSrc}`)
  }

  if (dryRun) {
    return {
      ...(key ? {_key: key} : {}),
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
    ...(key ? {_key: key} : {}),
    _type: 'imageWithAlt',
    image: {
      _type: 'image',
      asset: {_type: 'reference', _ref: uploadCache.get(imagePath)},
    },
    alt,
  }
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
