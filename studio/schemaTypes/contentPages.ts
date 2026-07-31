import {defineArrayMember, defineField, defineType} from 'sanity'

const pageGroups = [
  {name: 'page', title: 'Page', default: true},
  {name: 'sections', title: 'Sections'},
  {name: 'seo', title: 'SEO'},
]

const pageStatus = defineField({
  name: 'status',
  title: 'Status',
  type: 'string',
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
  defineField({name: 'badge', title: 'Badge', type: 'string', group: 'page'}),
  defineField({name: 'pageType', title: 'Page type', type: 'string', group: 'page'}),
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    group: 'page',
    validation: (Rule) => Rule.required().max(180),
  }),
  defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'page'}),
  defineField({name: 'image', title: 'Header/social image path', type: 'string', group: 'page'}),
  defineField({name: 'imageAlt', title: 'Header/social image alt', type: 'string', group: 'page'}),
  defineField({name: 'disableTagline', title: 'Disable tagline', type: 'boolean', group: 'page'}),
  pageStatus,
  defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
]

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
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
  title: 'FAQ page',
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
  title: 'Contact page',
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
  title: 'Generic page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'content', validation: (Rule) => Rule.required()}),
    pageStatus,
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'image', title: 'Image path', type: 'string', group: 'content'}),
    defineField({name: 'imageAlt', title: 'Image alt', type: 'string', group: 'content'}),
    defineField({name: 'date', title: 'Date', type: 'date', group: 'content'}),
    defineField({name: 'author', title: 'Author', type: 'string', group: 'content'}),
    defineField({name: 'categories', title: 'Categories', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content'}),
    defineField({name: 'bodyMarkdown', title: 'Body markdown', type: 'text', rows: 24, group: 'content'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})

export const caseStudiesIndex = defineType({
  name: 'caseStudiesIndex',
  title: 'Case studies page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({name: 'badgeSecondary', title: 'Detail badge', type: 'string', group: 'page'}),
    defineField({
      name: 'options',
      title: 'List options',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({name: 'layout', title: 'Layout', type: 'string'}),
        defineField({name: 'appearance', title: 'Appearance', type: 'string'}),
        defineField({name: 'limit', title: 'Limit', type: 'number'}),
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
  title: 'Case study',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content', validation: (Rule) => Rule.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', group: 'content', validation: (Rule) => Rule.required()}),
    pageStatus,
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, group: 'content'}),
    defineField({name: 'weight', title: 'Weight', type: 'number', group: 'content'}),
    defineField({name: 'image', title: 'Card image path', type: 'string', group: 'content'}),
    defineField({name: 'imageAlt', title: 'Card image alt', type: 'string', group: 'content'}),
    defineField({name: 'date', title: 'Date', type: 'date', group: 'content'}),
    defineField({name: 'datePublished', title: 'Date published', type: 'date', group: 'content'}),
    defineField({name: 'dateModified', title: 'Date modified', type: 'date', group: 'content'}),
    defineField({name: 'categories', title: 'Categories', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content'}),
    defineField({name: 'tags', title: 'Tags', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content'}),
    defineField({name: 'images', title: 'Gallery image paths', type: 'array', of: [defineArrayMember({type: 'string'})], group: 'content'}),
    defineField({
      name: 'information',
      title: 'Information rows',
      type: 'array',
      group: 'content',
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
    defineField({name: 'bodyMarkdown', title: 'Body markdown', type: 'text', rows: 24, group: 'content'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})

export const blogIndexPage = defineType({
  name: 'blogIndexPage',
  title: 'Blog index page',
  type: 'document',
  groups: pageGroups,
  fields: [
    ...pageFields,
    defineField({
      name: 'searchSection',
      title: 'Search section',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'searchPlaceholder', title: 'Search placeholder', type: 'string'}),
        defineField({name: 'noResultsText', title: 'No results text', type: 'string'}),
      ],
    }),
    defineField({
      name: 'taxonomyCopy',
      title: 'Taxonomy copy',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({name: 'categoryTitleSuffix', title: 'Category title suffix', type: 'string'}),
        defineField({name: 'categoryDescriptionPrefix', title: 'Category description prefix', type: 'string'}),
        defineField({name: 'tagTitlePrefix', title: 'Tag title prefix', type: 'string'}),
        defineField({name: 'tagDescriptionPrefix', title: 'Tag description prefix', type: 'string'}),
        defineField({name: 'paginationTitlePrefix', title: 'Pagination title prefix', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: '404 page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'SEO title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
    defineField({name: 'button', title: 'Button', type: 'globalButton'}),
    defineField({name: 'robots', title: 'Robots', type: 'string'}),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'title', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Image path', type: 'string'}),
    defineField({name: 'profession', title: 'Profession', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
        }),
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
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'content', title: 'Content', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'object',
      fields: [
        defineField({name: 'name', title: 'Name', type: 'string'}),
        defineField({name: 'icon', title: 'Icon path', type: 'string'}),
      ],
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        defineField({name: 'name', title: 'Name', type: 'string'}),
        defineField({name: 'role', title: 'Role', type: 'string'}),
        defineField({name: 'avatar', title: 'Avatar path', type: 'string'}),
        defineField({name: 'company', title: 'Company', type: 'string'}),
        defineField({name: 'companyLogo', title: 'Company logo path', type: 'string'}),
        defineField({name: 'rating', title: 'Rating', type: 'number'}),
      ],
    }),
    defineField({name: 'homeTwoVariant', title: 'Use in second layout', type: 'boolean'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  preview: {
    select: {title: 'customer.name', subtitle: 'customer.role'},
  },
})
