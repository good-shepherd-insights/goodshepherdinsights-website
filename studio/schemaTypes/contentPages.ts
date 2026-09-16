import {defineArrayMember, defineField, defineType} from 'sanity'

const pageGroups = [
  {name: 'page', title: 'Page', default: true},
  {name: 'sections', title: 'Sections'},
  {name: 'settings', title: 'Settings'},
  {name: 'seo', title: 'SEO'},
]

const pageStatus = defineField({
  name: 'status',
  title: 'Status',
  type: 'string',
  group: 'settings',
  description: 'Draft pages are hidden from the live site; only Published pages render.',
  options: {
    list: [
      {title: 'Published', value: 'published'},
      {title: 'Draft', value: 'draft'},
    ],
    layout: 'radio',
  },
  initialValue: 'published',
})

const pageFields = [
  defineField({name: 'badge', title: 'Badge', type: 'string', group: 'page', description: 'Small kicker label shown above the page title, e.g. "About us".'}),
  defineField({name: 'pageType', title: 'Page type', type: 'string', group: 'settings', description: 'Internal page-type identifier forwarded to the page layout.'}),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    group: 'page',
    description: 'Main on-page heading. Also used as the fallback SEO/browser-tab title. Max 180 characters.',
    validation: (Rule) => Rule.required().max(180),
  }),
  defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'page', description: 'Intro copy shown under the title; also used as a fallback meta description.'}),
  defineField({name: 'image', title: 'Header/social image path', type: 'string', group: 'page', description: 'Page header banner and fallback social-share image.'}),
  defineField({name: 'imageAlt', title: 'Header/social image alt', type: 'string', group: 'page', description: 'Alt text for the header/social image.'}),
  defineField({name: 'disableTagline', title: 'Disable tagline', type: 'boolean', group: 'settings', description: 'Hide the site tagline from this page\'s browser-tab title.'}),
  pageStatus,
  defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo', description: 'Overrides for this page\'s meta title, description, and indexing.'}),
]

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({name: 'heroSection', title: 'Hero section', type: 'aboutHeroSection', group: 'sections'}),
    defineField({name: 'featuresGrid', title: 'Features grid', type: 'featuresGridSection', group: 'sections'}),
    defineField({name: 'aboutSectionTwo', title: 'About section two', type: 'aboutContentSection', group: 'sections'}),
    defineField({name: 'statsSection', title: 'Stats section', type: 'statsSection', group: 'sections'}),
    defineField({name: 'teamSection', title: 'Team section', type: 'teamSection', group: 'sections'}),
    defineField({name: 'ctaVideoSection', title: 'CTA video section', type: 'ctaVideoSection', group: 'sections'}),
    defineField({name: 'aboutMetricsSection', title: 'About metrics section', type: 'aboutContentSection', group: 'sections'}),
    defineField({name: 'testimonialSectionTwo', title: 'Testimonial section', type: 'testimonialSection', group: 'sections'}),
    defineField({name: 'ctaGallerySection', title: 'CTA gallery section', type: 'ctaGallerySection', group: 'sections'}),
    defineField({name: 'brandLogos', title: 'Brand logos', type: 'brandLogosSection', group: 'sections'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({name: 'faqSection', title: 'FAQ section', type: 'faqSection', group: 'sections'}),
    defineField({name: 'statsMarqueeSection', title: 'Stats marquee section', type: 'statsMarqueeSection', group: 'sections'}),
    defineField({name: 'faqSectionTwo', title: 'Secondary FAQ section', type: 'faqSection', group: 'sections'}),
    defineField({name: 'ctaGallerySection', title: 'CTA gallery section', type: 'ctaGallerySection', group: 'sections'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({name: 'contactSection', title: 'Contact section', type: 'contactSection', group: 'sections'}),
    defineField({name: 'ctaGallerySection', title: 'CTA gallery section', type: 'ctaGallerySection', group: 'sections'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const genericPage = defineType({
  name: 'genericPage',
  title: 'Generic Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', description: 'Main on-page heading and fallback SEO title.', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'settings', description: 'URL path for this page, e.g. "privacy-policy".', validation: (Rule) => Rule.required()}),
    pageStatus,
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content', description: 'Intro copy and fallback meta description.'}),
    defineField({name: 'image', title: 'Image path', type: 'string', group: 'content', description: 'Header banner and fallback social-share image.'}),
    defineField({name: 'imageAlt', title: 'Image alt', type: 'string', group: 'content', description: 'Alt text for the header image.'}),
    defineField({name: 'date', title: 'Date', type: 'date', group: 'settings', description: 'Display date shown on the page, if the template renders one.'}),
    defineField({name: 'author', title: 'Author', type: 'string', group: 'content', description: 'Author name shown on the page, if the template renders one.'}),
    defineField({name: 'categories', title: 'Categories', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content', description: 'Category tags shown on the page, if the template renders them.'}),
    defineField({name: 'bodyMarkdown', title: 'Body markdown', type: 'text', rows: 24, group: 'content', description: 'Page body, written in Markdown.'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo', description: 'Overrides for this page\'s meta title, description, and indexing.'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})

export const caseStudiesIndex = defineType({
  name: 'caseStudiesIndex',
  title: 'Case Studies Page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({name: 'badgeSecondary', title: 'Detail badge', type: 'string', group: 'page', description: 'Kicker label shown on individual case study detail pages.'}),
    defineField({
      name: 'options',
      title: 'List options',
      type: 'object',
      group: 'sections',
      description: 'Display options for the case studies listing.',
      fields: [
        defineField({name: 'layout', title: 'Layout', type: 'string', description: 'Card layout for the listing, e.g. "grid" or "list".'}),
        defineField({name: 'appearance', title: 'Appearance', type: 'string', description: 'Visual style variant for the listing cards.'}),
        defineField({name: 'limit', title: 'Limit', type: 'number', description: 'Maximum number of case studies to show at once.'}),
      ],
    }),
    defineField({name: 'statsMarqueeSection', title: 'Stats marquee section', type: 'statsMarqueeSection', group: 'sections'}),
    defineField({name: 'ctaGallerySection', title: 'CTA gallery section', type: 'ctaGallerySection', group: 'sections'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', description: 'Case study headline and fallback SEO title.', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'settings', description: 'URL path for this case study.', validation: (Rule) => Rule.required()}),
    pageStatus,
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content', description: 'Summary shown on the case studies listing and as a fallback meta description.'}),
    defineField({name: 'weight', title: 'Weight', type: 'number', group: 'settings', description: 'Sort order on the case studies listing; lower numbers appear first.'}),
    defineField({name: 'image', title: 'Card image path', type: 'string', group: 'content', description: 'Image shown on the case studies listing card.'}),
    defineField({name: 'imageAlt', title: 'Card image alt', type: 'string', group: 'content', description: 'Alt text for the card image.'}),
    defineField({name: 'date', title: 'Date', type: 'date', group: 'settings', description: 'Display date shown on the case study.'}),
    defineField({name: 'datePublished', title: 'Date published', type: 'date', group: 'settings', description: 'First-published date used for JSON-LD structured data.'}),
    defineField({name: 'dateModified', title: 'Date modified', type: 'date', group: 'settings', description: 'Last-modified date used for JSON-LD structured data.'}),
    defineField({name: 'categories', title: 'Categories', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content', description: 'Category tags shown on the case study.'}),
    defineField({name: 'tags', title: 'Tags', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content', description: 'Freeform tags shown on the case study.'}),
    defineField({name: 'images', title: 'Gallery image paths', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content', description: 'Additional images shown in the case study\'s gallery.'}),
    defineField({
      name: 'information',
      title: 'Information rows',
      type: 'array',
      group: 'content',
      description: 'Key/value facts shown in the case study\'s summary panel, e.g. "Industry" / "Healthcare".',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'value', title: 'Value', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'bodyMarkdown', title: 'Body markdown', type: 'text', rows: 24, group: 'content', description: 'Case study body, written in Markdown.'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo', description: 'Overrides for this case study\'s meta title, description, and indexing.'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})

export const blogIndexPage = defineType({
  name: 'blogIndexPage',
  title: 'Blog Index Page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({
      name: 'searchSection',
      title: 'Search section',
      type: 'object',
      group: 'sections',
      description: 'Search box shown at the top of the blog index.',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string', description: 'Heading above the search box.'}),
        defineField({name: 'searchPlaceholder', title: 'Search placeholder', type: 'string', description: 'Placeholder text shown in the empty search box.'}),
        defineField({name: 'noResultsText', title: 'No results text', type: 'string', description: 'Message shown when a search returns no posts.'}),
      ],
    }),
    defineField({
      name: 'taxonomyCopy',
      title: 'Taxonomy copy',
      type: 'object',
      group: 'sections',
      description: 'Text templates used to build headings on category/tag/pagination pages.',
      fields: [
        defineField({name: 'categoryTitleSuffix', title: 'Category title suffix', type: 'string', description: 'Appended after the category name in that category page\'s title.'}),
        defineField({name: 'categoryDescriptionPrefix', title: 'Category description prefix', type: 'string', description: 'Prepended before the category name in that category page\'s description.'}),
        defineField({name: 'tagTitlePrefix', title: 'Tag title prefix', type: 'string', description: 'Prepended before the tag name in that tag page\'s title.'}),
        defineField({name: 'tagDescriptionPrefix', title: 'Tag description prefix', type: 'string', description: 'Prepended before the tag name in that tag page\'s description.'}),
        defineField({name: 'paginationTitlePrefix', title: 'Pagination title prefix', type: 'string', description: 'Prepended before the page number on paginated blog listing pages.'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'SEO title', type: 'string', description: 'Browser-tab title for the 404 page.', validation: (Rule) => Rule.required()}),
    defineField({name: 'heading', title: 'Heading', type: 'string', description: 'On-page heading shown to visitors who hit a missing page.', validation: (Rule) => Rule.required()}),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 3, description: 'Body copy shown under the heading.', validation: (Rule) => Rule.required()}),
    defineField({name: 'button', title: 'Button', type: 'globalButton', description: 'Call-to-action button shown on the 404 page, e.g. "Back to homepage".'}),
    defineField({name: 'robots', title: 'Robots', type: 'string', description: 'Robots meta value for the 404 page, e.g. "noindex, follow".'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Uncheck to hide this team member without deleting their profile.', initialValue: true}),
    defineField({name: 'title', title: 'Name', type: 'string', description: 'Team member\'s full name.', validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Image path', type: 'string', description: 'Headshot photo path.'}),
    defineField({name: 'profession', title: 'Profession', type: 'string', description: 'Job title shown under the name, e.g. "Senior Consultant".'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Short bio shown on the team member\'s card or detail view.'}),
    defineField({name: 'email', title: 'Email', type: 'string', description: 'Contact email shown on the team member\'s profile.'}),
    defineField({name: 'phone', title: 'Phone', type: 'string', description: 'Contact phone number shown on the team member\'s profile.'}),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      description: 'Social profile links shown on the team member\'s profile.',
      of: [
        defineArrayMember({type: 'socialLink'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'profession'},
  },
})

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Uncheck to hide this testimonial without deleting it.', initialValue: true}),
    defineField({name: 'content', title: 'Content', type: 'text', rows: 4, description: 'The testimonial quote itself.', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'object',
      description: 'Where this testimonial was originally posted, e.g. Google or Trustpilot.',
      fields: [
        defineField({name: 'name', title: 'Name', type: 'string', description: 'Platform name, e.g. "Google Reviews".'}),
        defineField({name: 'icon', title: 'Icon path', type: 'string', description: 'Path to the platform\'s icon/logo.'}),
      ],
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
      description: 'Who gave this testimonial.',
      fields: [
        defineField({name: 'name', title: 'Name', type: 'string', description: 'Customer\'s full name.'}),
        defineField({name: 'role', title: 'Role', type: 'string', description: 'Customer\'s job title.'}),
        defineField({name: 'avatar', title: 'Avatar path', type: 'string', description: 'Path to the customer\'s photo.'}),
        defineField({name: 'company', title: 'Company', type: 'string', description: 'Customer\'s organization.'}),
        defineField({name: 'companyLogo', title: 'Company logo path', type: 'string', description: 'Path to the customer\'s company logo.'}),
        defineField({name: 'rating', title: 'Rating', type: 'number', description: 'Star rating, if the layout displays one.'}),
      ],
    }),
    defineField({name: 'homeTwoVariant', title: 'Use in second layout', type: 'boolean', description: 'Include this testimonial in the alternate homepage testimonial layout.'}),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Sort order among testimonials; lower numbers appear first.'}),
  ],
  preview: {
    select: {title: 'customer.name', subtitle: 'customer.role'},
  },
})
