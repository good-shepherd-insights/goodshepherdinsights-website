import fs from 'node:fs'
import crypto from 'node:crypto'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

import {createClient} from '@sanity/client'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..', '..')
const tokenPath = path.join(os.homedir(), '.config', 'sanity', 'config.json')
const authToken = JSON.parse(fs.readFileSync(tokenPath, 'utf8')).authToken
const dryRun = process.argv.includes('--dry-run')

const client = createClient({
  projectId: '8yy9mp89',
  dataset: 'production',
  apiVersion: '2026-01-01',
  token: authToken,
  useCdn: false,
})

const uiCopy = {
  aria: {
    backToTop: 'Back to top',
    closeModal: 'Close modal',
    playVideo: 'Play video',
  },
  button: {
    readMore: 'Read More',
  },
  common: {
    home: 'Home',
    readMore: 'Read More',
    viewDetails: 'View Details',
    readMoreAbout: 'Read more about',
    viewProject: 'View Project',
    learnMoreAbout: 'Learn more about',
    emailPlaceholder: 'Email Address',
    paginationPrevious: 'Previous',
    paginationNext: 'Next',
    paginationCaseStudiesPrev: 'Previous Case Study',
    paginationCaseStudiesNext: 'Next Case Study',
    workingHours: 'Working Hours',
    workHour: 'Work Hour',
    workingHoursValue: 'Sunday-Thursday, 9 AM - 5 PM',
    workHourValue: 'Monday-Friday: 9 AM - 5 PM',
    call: 'Call:',
    callUs: 'Call Us',
    play: 'Play',
    contactUs: 'Contact Us',
    ourServices: 'Our Services',
    recentProjects: 'Recent Projects',
    discoverMore: 'Discover More',
    hotLine: 'Direct Line',
    searchHere: 'Search Here',
    letsChat: "Let's Chat",
    sendRequest: 'Send Request',
    noFaqsFoundFor: 'No FAQs found for',
    loadingMap: 'Loading Map...',
    comments: 'Comments',
    reply: 'Reply',
    by: 'By',
  },
  widgets: {
    postSearchFormPlaceholder: "Try Searching 'strategy'...",
    categoriesTitle: 'Categories',
    tagsTitle: 'Tags',
    popularTagsTitle: 'Popular Tags',
    recentPostsTitle: 'Recent Posts',
    noPostsFoundFor: 'No posts found for',
    haveAnyQuestionsTitle: 'Have Any Questions?',
    haveAnyQuestionsDescription:
      "Our Fractional CTO team is ready to help you build a strategic roadmap for your church's technology.",
  },
  header: {
    announcement:
      "Get your Technology Strategy Audit and secure your church's digital future. [Get Started](/contact/)",
  },
  headerOffcanvas: {
    description: 'We provide strategic technology leadership for mid-sized East Coast churches.',
    buttonLabel: "Let's Talk With Us",
  },
  blog: {
    category: 'Category',
    share: 'Share:',
    follow: 'Follow:',
    paginationPrevious: 'Previous Post',
    paginationNext: 'Next Post',
    defaultAuthorRole: 'Fractional CTO',
    defaultAuthorBio:
      'Fractional CTO providing strategic technology leadership for mid-sized churches.',
  },
  languages: {
    en: 'US - English',
    fr: 'FR - Français',
  },
  forms: {
    chooseOption: 'Choose',
    missingLabel: 'Please set label',
    missingName: 'Please set name value',
    missingPlaceholder: 'Please set placeholder',
    invalidSelect: 'Please select a valid option.',
    validSelect: 'Ready.',
    exampleId: 'example-id',
    exampleLabel: 'Example Label',
    submitting: 'Form submitting...',
  },
  navigation: {
    buttonLabel: 'Get in Touch',
  },
  subscription: {
    title: 'Stay updated on strategic technology insights for ministries',
  },
  footer: {
    menuTitleLinks: 'Links',
    freeSupport: 'Free Support',
    description:
      'We provide professional Fractional CTO services to help churches align their technology with their mission.',
    contact: 'Contact',
    copyright:
      'Copyright (c) {{ year }}. [Good Shepherd Insights](https://goodshepherdinsights.com) All Rights Reserved.',
    since: 'Established 2024',
  },
}

const cmsAssetUrls = dryRun
  ? {
      defaultImage: '/images/og-image.jpg',
      pageHeaderDefaultImage: '/images/page-header/default.png',
      logo: '/images/good-shepherd-insights.svg',
      faviconAppleTouch: null,
      favicon96: null,
      faviconSvg: null,
      faviconIco: null,
      favicon192: null,
      favicon512: null,
    }
  : await uploadCmsAssets()

const siteGlobalsPatch = {
  brand: {
    _type: 'globalBrand',
    title: 'Good Shepherd Insights',
    logoPath: cmsAssetUrls.logo,
    logoAlternatePath: cmsAssetUrls.logo,
    logoText: '',
    logoWidth: '320px',
    logoHeight: '75px',
  },
  seoDefaults: {
    _type: 'globalSeoDefaults',
    author: 'Good Shepherd Insights',
    title: 'Good Shepherd Insights',
    description:
      'Professional Fractional CTO services for mid-sized East Coast churches. We provide strategic technology leadership to align your tools with your mission.',
    tagline: 'Fractional CTO leadership for mid-sized churches',
    taglineSeparator: '',
    baseUrl: 'https://goodshepherdinsights.com',
    defaultImage: cmsAssetUrls.defaultImage,
    pageHeaderDefaultImage: cmsAssetUrls.pageHeaderDefaultImage,
    faviconSet: [
      faviconSetItem('apple-touch-icon', null, '180x180', null, cmsAssetUrls.faviconAppleTouch),
      faviconSetItem('icon', 'image/png', '96x96', null, cmsAssetUrls.favicon96),
      faviconSetItem('icon', 'image/png', '192x192', null, cmsAssetUrls.favicon192),
      faviconSetItem('icon', 'image/png', '512x512', null, cmsAssetUrls.favicon512),
      faviconSetItem('icon', 'image/svg+xml', null, null, cmsAssetUrls.faviconSvg),
      faviconSetItem('shortcut icon', null, null, null, cmsAssetUrls.faviconIco),
    ].filter(Boolean),
    keywords: [
      'fractional cto for churches',
      'church technology strategy',
      'mid-sized church tech solutions',
      'church software optimization',
      'technology audit for churches',
      'church digital transformation',
      'east coast church technology',
      'church vendor management',
    ],
    robots: 'index, follow',
    ogLocale: 'en_US',
    ogType: 'website',
    twitter: '@GSInsights',
    twitterCard: 'summary_large_image',
    themeColorLight: '#ffffff',
    themeColorDark: '#000000',
    headContent: '',
  },
  organization: {
    _type: 'globalOrganization',
    name: 'Good Shepherd Insights',
    streetAddress: '',
    addressLocality: 'East Coast',
    addressRegion: 'USA',
    email: 'contact@goodshepherdinsights.com',
    telephone: '',
    logo: cmsAssetUrls.logo,
  },
  indexing: {
    _type: 'globalIndexing',
    robotsTxt: {_type: 'object', enable: true, disallow: []},
    sitemap: {
      _type: 'object',
      enable: true,
      exclude: ['case-studies', 'team', 'pricing', 'category', 'tag', '404'],
    },
  },
  forms: {
    _type: 'globalForms',
    contactFormProvider: 'formsubmit.co',
    contactFormAction: 'https://formsubmit.co/contact@goodshepherdinsights.com',
    subscriptionFormAction:
      'https://gmail.us11.list-manage.com/subscribe/post?u=d870b06d86c16269e4b1f9b39&amp;id=12cf0c6ac2&amp;f_id=007e61e1f0',
    mailchimpTagValue: '',
    messages: {
      _type: 'object',
      missingAction: 'Form action URL is missing.',
      subscribeSuccess: 'Thank you for subscribing!',
      subscribeError: 'An error occurred. Please try again.',
      subscribeNetworkError: 'There was an error processing your request. Please try again later.',
    },
  },
  uiCopy: {
    _type: 'globalUiCopy',
    copy: JSON.stringify(uiCopy, null, 2),
  },
  appManifest: {
    _type: 'globalAppManifest',
    name: 'Good Shepherd Insights',
    shortName: 'Good Shepherd Insights',
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
    display: 'standalone',
    icons: [
      manifestIcon('192x192', 'image/png', 'maskable', cmsAssetUrls.favicon192),
      manifestIcon('512x512', 'image/png', 'maskable', cmsAssetUrls.favicon512),
    ].filter(Boolean),
  },
}

const requiredSiteGlobalsDefaults = {
  _id: 'site-globals',
  _type: 'siteGlobals',
  brand: {
    _type: 'globalBrand',
    title: 'Good Shepherd Insights',
    logoPath: cmsAssetUrls.logo,
    logoAlternatePath: cmsAssetUrls.logo,
    logoText: '',
    logoWidth: '320px',
    logoHeight: '75px',
  },
  contact: {
    _type: 'globalContact',
    addressText: 'East Coast, USA',
    phoneLabel: '(240) 441-5259',
    phoneHref: 'tel:+12404415259',
    emailLabel: 'contact@goodshepherdinsights.com',
    emailHref: 'mailto:contact@goodshepherdinsights.com',
    mapEmbedUrl: 'https://www.google.com/maps?q=East+Coast,USA&output=embed',
  },
  socialLinks: [
    socialLink('Facebook', 'https://www.facebook.com/goodshepherdinsights', 0),
    socialLink('Twitter', 'https://twitter.com/goodshepherdinsights', 1),
    socialLink('Linkedin', 'https://www.linkedin.com/goodshepherdinsights', 2),
    socialLink('Instagram', 'https://www.instagram.com/goodshepherdinsights', 3),
    socialLink('Youtube', 'https://www.youtube.com/goodshepherdinsights', 4),
    socialLink('WhatsApp', 'https://wa.me/1234567890', 5, false),
  ],
  header: {
    _type: 'globalHeader',
    primaryNavigation: [
      navigationItem('Home', '/', 0),
      navigationItem('About Us', '/about/', 1),
      navigationItem('Services', '/services/', 2),
      navigationItem('Pricing', '/pricing/', 3, false),
      navigationItem('Contact', '/contact/', 4),
      {...navigationItem('Resources', '', 5), children: [navigationChild('FAQ', '/faq/', 0), navigationChild('Blog', '/blog/', 1)]},
      {...navigationItem('Pages', '', 11, false), children: []},
    ],
    navigationButton: button('Get in Touch', '/contact/', true, 'fill', 'creative-fill'),
    topBar: {
      _type: 'object',
      workingHoursLabel: 'Working Hours',
      workingHoursValue: 'Sunday-Thursday, 9 AM - 5 PM',
      callLabel: 'Call:',
      hotLineLabel: 'Direct Line',
      letsChatLabel: "Let's Chat",
    },
    announcementBar: {
      _type: 'object',
      enable: true,
      label:
        "Get your Technology Strategy Audit and secure your church's digital future. [Get Started](/contact/)",
    },
    offcanvas: {
      _type: 'object',
      enable: true,
      description: 'We provide strategic technology leadership for mid-sized East Coast churches.',
      button: button("Let's Talk With Us", '/contact/', true, 'circle', 'magnetic'),
    },
  },
  footer: {
    _type: 'globalFooter',
    primary: {
      _type: 'object',
      description:
        'We provide professional Fractional CTO services to help churches align their technology with their mission.',
      supportLabel: 'Free Support',
      servicesHeading: 'Our Services',
      contactHeading: 'Contact Us',
      workHourLabel: 'Work Hour',
      workHourValue: 'Monday-Friday: 9 AM - 5 PM',
      sinceText: 'Established 2024',
      navigation: [
        navigationChild('About us', '/about/', 0),
        navigationChild('Service', '/services/', 1),
        navigationChild('Team', '/team/', 2, false),
        navigationChild('Blog', '/blog/', 3),
        navigationChild('Contact us', '/contact/', 4),
      ],
    },
    secondary: {
      _type: 'object',
      description:
        'We provide professional Fractional CTO services to help churches align their technology with their mission.',
      callUsLabel: 'Call Us',
      subscription: {
        _type: 'object',
        enable: true,
        title: 'Stay updated on strategic technology insights for ministries',
        note: '',
        formAction:
          'https://gmail.us11.list-manage.com/subscribe/post?u=d870b06d86c16269e4b1f9b39&amp;id=12cf0c6ac2&amp;f_id=007e61e1f0',
        mailchimpTagValue: '',
        emailPlaceholder: 'Email Address',
        submitLabel: 'Send Request',
      },
      navigation: [
        navigationChild('About', '/about/', 0),
        navigationChild('Services', '/services/', 1),
        navigationChild('Projects', '/case-studies/', 2, false),
        navigationChild('Blog', '/blog/', 3),
        navigationChild('Contact', '/contact/', 4),
      ],
    },
    copyright: {
      _type: 'object',
      enable: true,
      text:
        'Copyright (c) {{ year }}. [Good Shepherd Insights](https://goodshepherdinsights.com) All Rights Reserved.',
    },
  },
  ...siteGlobalsPatch,
}

const aboutFeatureGrid = {
  _type: 'featuresGridSection',
  enable: true,
  title: 'Strategic leadership for your scattered decisions',
  features: [
    feature(
      'premium-quality',
      '/images/icons/svg/premium-quality.svg',
      'Objective vendor selection',
      'We bring an objective lens to software pitches so you choose tools that support your ministry.',
    ),
    feature(
      'group',
      '/images/icons/svg/group.svg',
      'Strategic roadmap development',
      "Move past reactive tech fixes with a professional plan that aligns your technology with your church's long-term vision.",
    ),
    feature(
      'support',
      '/images/icons/svg/24-hours-support.svg',
      'Ongoing Fractional CTO partnership',
      'Get executive-level technology oversight without the cost of a full-time hire, ensuring your systems remain secure and efficient.',
    ),
  ],
}

const blogIndexPage = {
  _id: 'blog-index-page',
  _type: 'blogIndexPage',
  status: 'published',
  badge: 'Insights & Updates',
  title: 'Practical guidance on ministry technology',
  description: 'Strategic technology insights for ministries and churches.',
  seo: {
    _type: 'seoFields',
    metaTitle: 'Practical guidance on ministry technology',
    metaDescription: 'Strategic technology insights for ministries and churches.',
    robots: 'index, follow',
  },
  searchSection: {
    _type: 'object',
    title: 'Search ministry technology insights',
    searchPlaceholder: 'Search insights',
    noResultsText: 'No matching insights found.',
  },
  taxonomyCopy: {
    _type: 'object',
    categoryTitleSuffix: 'posts',
    categoryDescriptionPrefix: 'Church technology insights and guidance tagged',
    tagTitlePrefix: 'Tag',
    tagDescriptionPrefix: 'Ministry technology articles tagged',
    paginationTitlePrefix: 'Blog - Page',
  },
}

const notFoundPage = {
  _id: 'not-found-page',
  _type: 'notFoundPage',
  title: 'Page Not Found',
  heading: "Looks Like You're Lost",
  message: 'The link you followed is probably broken or the page has been removed.',
  robots: 'noindex, nofollow',
  button: {
    _type: 'globalButton',
    enable: true,
    label: 'Back to Home',
    url: '/',
    variant: 'text',
  },
}

const contactPagePatch = {
  title: 'Contact Good Shepherd Insights',
  description: "Start a conversation about strategic technology leadership for your church.",
  seo: {
    _type: 'seoFields',
    metaTitle: 'Contact Good Shepherd Insights',
    metaDescription: "Start a conversation about strategic technology leadership for your church.",
    robots: 'index, follow',
  },
}

const operations = [
  ['createIfNotExists', requiredSiteGlobalsDefaults],
  ['patch', 'site-globals', siteGlobalsPatch],
  ['patch', 'about-page', {featuresGrid: aboutFeatureGrid}],
  ['patch', 'contact-page', contactPagePatch],
  ['createOrReplace', blogIndexPage],
  ['createOrReplace', notFoundPage],
]

if (dryRun) {
  console.log(JSON.stringify({operations}, null, 2))
} else {
  await client.createIfNotExists(requiredSiteGlobalsDefaults)
  await client.patch('site-globals').set(siteGlobalsPatch).commit()
  await client.patch('about-page').set({featuresGrid: aboutFeatureGrid}).commit()
  await client.patch('contact-page').set(contactPagePatch).commit()
  await client.createOrReplace(blogIndexPage)
  await client.createOrReplace(notFoundPage)
  console.log('Migrated final CMS-owned site data')
}

async function uploadCmsAssets() {
  return {
    defaultImage: await uploadCmsImage('public/images/og-image.jpg'),
    pageHeaderDefaultImage: await uploadCmsImage('src/assets/images/page-header/default.png'),
    logo: await uploadCmsImage('src/assets/images/good-shepherd-insights.svg'),
    faviconAppleTouch: await uploadCmsImageAsset(
      'public/images/favicons/apple-touch-icon.png',
      'Apple touch icon',
    ),
    favicon96: await uploadCmsImageAsset(
      'public/images/favicons/favicon-96x96.png',
      'Favicon 96x96',
    ),
    faviconSvg: await uploadCmsImageAsset(
      'public/images/favicons/favicon.svg',
      'Favicon SVG',
    ),
    faviconIco: await uploadCmsImageAsset(
      'public/images/favicons/favicon-ico-as-png.png',
      'Favicon ICO (converted to PNG for upload)',
    ),
    favicon192: await uploadCmsImageAsset(
      'public/images/favicons/web-app-manifest-192x192.png',
      'Web app manifest icon 192x192',
    ),
    favicon512: await uploadCmsImageAsset(
      'public/images/favicons/web-app-manifest-512x512.png',
      'Web app manifest icon 512x512',
    ),
  }
}

async function uploadCmsImage(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath)
  const buffer = fs.readFileSync(absolutePath)
  const sha1hash = crypto.createHash('sha1').update(buffer).digest('hex')
  const existingUrl = await client.fetch(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1hash][0].url',
    {sha1hash},
  )

  if (existingUrl) {
    return existingUrl
  }

  const asset = await client.assets.upload('image', fs.createReadStream(absolutePath), {
    filename: path.basename(absolutePath),
  })

  return asset.url
}

async function uploadCmsImageAsset(relativePath, alt) {
  const absolutePath = path.join(repoRoot, relativePath)
  const buffer = fs.readFileSync(absolutePath)
  const sha1hash = crypto.createHash('sha1').update(buffer).digest('hex')
  const existingAsset = await client.fetch(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1hash][0]{_id}',
    {sha1hash},
  )

  const assetId =
    existingAsset?._id ??
    (
      await client.assets.upload('image', fs.createReadStream(absolutePath), {
        filename: path.basename(absolutePath),
      })
    )._id

  return {
    _type: 'imageWithAlt',
    alt,
    image: {
      _type: 'image',
      asset: {_type: 'reference', _ref: assetId},
    },
  }
}

function button(label, url, enable = true, variant, hoverEffect) {
  return {
    _type: 'globalButton',
    enable,
    label,
    url,
    ...(variant ? {variant} : {}),
    ...(hoverEffect ? {hoverEffect} : {}),
  }
}

function socialLink(label, url, index, enable = true) {
  return {
    _key: `social-${index}`,
    _type: 'socialLink',
    enable,
    label,
    url,
  }
}

function navigationItem(name, url, weight, enable = true) {
  return {
    _key: `nav-${weight}-${slug(name)}`,
    _type: 'navigationItem',
    enable,
    name,
    ...(url ? {url} : {}),
    weight,
  }
}

function navigationChild(name, url, weight, enable = true) {
  return {
    _key: `nav-child-${weight}-${slug(name)}`,
    _type: 'navigationChildItem',
    enable,
    name,
    url,
    weight,
  }
}

function manifestIcon(sizes, type, purpose, imageAsset) {
  if (!imageAsset) return null
  return {
    _key: `manifest-${sizes}`,
    _type: 'object',
    sizes,
    type,
    purpose,
    image: imageAsset,
  }
}

function faviconSetItem(rel, type, sizes, color, imageAsset) {
  if (!imageAsset) return null
  return {
    _key: `favicon-${rel}-${sizes || type || 'default'}`,
    _type: 'globalFaviconItem',
    rel,
    ...(type ? {type} : {}),
    ...(sizes ? {sizes} : {}),
    ...(color ? {color} : {}),
    image: imageAsset,
  }
}

function feature(key, icon, title, description) {
  return {
    _key: key,
    _type: 'object',
    enable: true,
    icon,
    title,
    description,
    backgroundImage: '/images/decorative/pattern/pattern-4.png',
    backgroundImageAlt: 'Background Pattern',
  }
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
