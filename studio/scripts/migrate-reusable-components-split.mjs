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

const fieldToDoc = [
  {field: 'aboutSectionTwo', id: 'about-section-two', type: 'defaultAboutSectionTwo'},
  {field: 'aboutMetricsSection', id: 'about-metrics-section', type: 'defaultAboutMetricsSection'},
  {field: 'statsSection', id: 'stats-section', type: 'defaultStatsSection'},
  {field: 'statsMarqueeSection', id: 'stats-marquee-section', type: 'defaultStatsMarqueeSection'},
  {field: 'teamSection', id: 'team-section', type: 'defaultTeamSection'},
  {field: 'testimonialSection', id: 'testimonial-section', type: 'defaultTestimonialSection'},
  {field: 'testimonialSectionTwo', id: 'testimonial-section-two', type: 'defaultTestimonialSectionTwo'},
  {field: 'faqSection', id: 'faq-section', type: 'defaultFaqSection'},
  {field: 'faqSectionTwo', id: 'faq-section-two', type: 'defaultFaqSectionTwo'},
  {field: 'contactSection', id: 'contact-section', type: 'defaultContactSection'},
  {field: 'contactSectionTwo', id: 'contact-section-two', type: 'defaultContactSectionTwo'},
  {field: 'ctaGallerySection', id: 'cta-gallery-section', type: 'defaultCtaGallerySection'},
  {field: 'ctaVideoSection', id: 'cta-video-section', type: 'defaultCtaVideoSection'},
  {field: 'ctaVideoSectionTwo', id: 'cta-video-section-two', type: 'defaultCtaVideoSectionTwo'},
  {field: 'ctaBarSection', id: 'cta-bar-section', type: 'defaultCtaBarSection'},
  {field: 'heroSectionTwo', id: 'hero-section-two', type: 'defaultHeroSectionTwo'},
  {field: 'socialBarSection', id: 'social-bar-section', type: 'defaultSocialBarSection'},
  {field: 'brandLogos', id: 'brand-logos', type: 'defaultBrandLogos'},
  {field: 'pricingSection', id: 'pricing-section', type: 'defaultPricingSection'},
  {field: 'caseStudiesSection', id: 'case-studies-section', type: 'defaultCaseStudiesSection'},
  {field: 'blogSection', id: 'blog-section', type: 'defaultBlogSection'},
  {field: 'blogSectionTwo', id: 'blog-section-two', type: 'defaultBlogSectionTwo'},
  {field: 'ctaSection', id: 'cta-section', type: 'defaultCtaSection'},
]

const operations = []

const oldDoc = await client.fetch(
  `*[_type == "reusableComponents" && _id == "reusable-components"][0]`,
)

if (oldDoc) {
  for (const {field, id, type} of fieldToDoc) {
    const value = oldDoc[field]
    if (value === undefined) continue
    operations.push({kind: 'createOrReplace', doc: {_id: id, _type: type, content: value}})
  }
  operations.push({kind: 'delete', id: 'reusable-components'})
}

if (dryRun) {
  console.log(JSON.stringify(operations, null, 2))
} else {
  for (const op of operations) {
    if (op.kind === 'createOrReplace') {
      await client.createOrReplace(op.doc)
    } else if (op.kind === 'delete') {
      await client.delete(op.id)
    }
  }
  console.log(`Applied ${operations.length} operation(s).`)
}
