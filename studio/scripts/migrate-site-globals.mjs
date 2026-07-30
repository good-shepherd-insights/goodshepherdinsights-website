import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import {createClient} from '@sanity/client'

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

const document = {
  _id: 'site-globals',
  _type: 'siteGlobals',
  brand: {
    _type: 'globalBrand',
    title: 'Good Shepherd Insights',
    logoPath: '/images/good-shepherd-insights.svg',
    logoAlternatePath: '/images/good-shepherd-insights.svg',
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
      {
        ...navigationItem('Resources', '', 5),
        children: [
          navigationChild('FAQ', '/faq/', 0),
          navigationChild('Blog', '/blog/', 1),
        ],
      },
      {
        ...navigationItem('Pages', '', 11, false),
        children: [],
      },
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
      text: 'Copyright \u00a9 {{ year }}. [Good Shepherd Insights](https://goodshepherdinsights.com) All Rights Reserved.',
    },
  },
}

if (dryRun) {
  console.log(JSON.stringify(document, null, 2))
} else {
  await client.createOrReplace(document)
  console.log('Migrated site-globals')
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

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
