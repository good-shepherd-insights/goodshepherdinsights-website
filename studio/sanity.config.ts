import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import type {StructureResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singletonDocuments = [
  {type: 'homePage', id: 'home-page', title: 'Homepage'},
  {type: 'serviceIndex', id: 'service-index', title: 'Services Page'},
  {type: 'aboutPage', id: 'about-page', title: 'About Page'},
  {type: 'faqPage', id: 'faq-page', title: 'FAQ Page'},
  {type: 'contactPage', id: 'contact-page', title: 'Contact Page'},
  {type: 'blogIndexPage', id: 'blog-index-page', title: 'Blog Index Page'},
  {type: 'notFoundPage', id: 'not-found-page', title: '404 Page'},
  {type: 'caseStudiesIndex', id: 'case-studies-index', title: 'Case Studies Page'},
  {type: 'defaultAboutSectionTwo', id: 'about-section-two', title: 'About Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultAboutMetricsSection', id: 'about-metrics-section', title: 'About Metrics Section (Default)', group: 'reusable-sections'},
  {type: 'defaultStatsSection', id: 'stats-section', title: 'Stats Section (Default)', group: 'reusable-sections'},
  {type: 'defaultStatsMarqueeSection', id: 'stats-marquee-section', title: 'Stats Marquee Section (Default)', group: 'reusable-sections'},
  {type: 'defaultTeamSection', id: 'team-section', title: 'Team Section (Default)', group: 'reusable-sections'},
  {type: 'defaultTestimonialSection', id: 'testimonial-section', title: 'Testimonial Section (Default)', group: 'reusable-sections'},
  {type: 'defaultTestimonialSectionTwo', id: 'testimonial-section-two', title: 'Testimonial Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultFaqSection', id: 'faq-section', title: 'FAQ Section (Default)', group: 'reusable-sections'},
  {type: 'defaultFaqSectionTwo', id: 'faq-section-two', title: 'FAQ Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultContactSection', id: 'contact-section', title: 'Contact Section (Default)', group: 'reusable-sections'},
  {type: 'defaultContactSectionTwo', id: 'contact-section-two', title: 'Contact Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultCtaGallerySection', id: 'cta-gallery-section', title: 'CTA Gallery Section (Default)', group: 'reusable-sections'},
  {type: 'defaultCtaVideoSection', id: 'cta-video-section', title: 'CTA Video Section (Default)', group: 'reusable-sections'},
  {type: 'defaultCtaVideoSectionTwo', id: 'cta-video-section-two', title: 'CTA Video Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultCtaBarSection', id: 'cta-bar-section', title: 'CTA Bar Section (Default)', group: 'reusable-sections'},
  {type: 'defaultHeroSectionTwo', id: 'hero-section-two', title: 'Hero Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultSocialBarSection', id: 'social-bar-section', title: 'Social Bar Section (Default)', group: 'reusable-sections'},
  {type: 'defaultBrandLogos', id: 'brand-logos', title: 'Brand Logos (Default)', group: 'reusable-sections'},
  {type: 'defaultPricingSection', id: 'pricing-section', title: 'Pricing Section (Default)', group: 'reusable-sections'},
  {type: 'defaultCaseStudiesSection', id: 'case-studies-section', title: 'Case Studies Section (Default)', group: 'reusable-sections'},
  {type: 'defaultBlogSection', id: 'blog-section', title: 'Blog Section (Default)', group: 'reusable-sections'},
  {type: 'defaultBlogSectionTwo', id: 'blog-section-two', title: 'Blog Section Two (Default)', group: 'reusable-sections'},
  {type: 'defaultCtaSection', id: 'cta-section', title: 'CTA Section (Default)', group: 'reusable-sections'},
  {type: 'brand', id: 'brand', title: 'Brand', group: 'site-settings'},
  {type: 'contact', id: 'contact', title: 'Contact', group: 'site-settings'},
  {type: 'organization', id: 'organization', title: 'Organization', group: 'site-settings'},
  {type: 'socialLinks', id: 'social-links', title: 'Social Links', group: 'site-settings'},
  {type: 'header', id: 'header', title: 'Header', group: 'site-settings'},
  {type: 'footer', id: 'footer', title: 'Footer', group: 'site-settings'},
  {type: 'seoDefaults', id: 'seo-defaults', title: 'SEO Defaults', group: 'site-settings'},
  {type: 'indexing', id: 'indexing', title: 'Indexing', group: 'site-settings'},
  {type: 'forms', id: 'forms', title: 'Forms', group: 'site-settings'},
  {type: 'uiCopy', id: 'ui-copy', title: 'UI Copy', group: 'site-settings'},
  {type: 'appManifest', id: 'app-manifest', title: 'App Manifest', group: 'site-settings'},
] as const

const singletonTypes = new Set<string>(singletonDocuments.map((doc) => doc.type))

const singletonGroups = [
  {id: 'reusable-sections', title: 'Reusable Sections'},
  {id: 'site-settings', title: 'Site Settings'},
] as const

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...singletonDocuments
        .filter((doc) => !('group' in doc))
        .map((doc) =>
          S.listItem()
            .title(doc.title)
            .id(doc.id)
            .child(S.document().schemaType(doc.type).documentId(doc.id)),
        ),
      S.divider(),
      ...singletonGroups.map((group) =>
        S.listItem()
          .title(group.title)
          .id(group.id)
          .child(
            S.list()
              .title(group.title)
              .items(
                singletonDocuments
                  .filter((doc) => 'group' in doc && doc.group === group.id)
                  .map((doc) =>
                    S.listItem()
                      .title(doc.title)
                      .id(doc.id)
                      .child(S.document().schemaType(doc.type).documentId(doc.id)),
                  ),
              ),
          ),
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? '')),
    ])

export default defineConfig({
  name: 'default',
  title: 'Good Shepherd Insights',

  projectId: '8yy9mp89',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({action}) => action !== 'delete' && action !== 'duplicate')
        : input,
  },
})
