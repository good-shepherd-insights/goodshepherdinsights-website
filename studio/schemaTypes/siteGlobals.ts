import {defineArrayMember, defineField, defineType} from 'sanity'

const buttonOptions = [
  {title: 'Fill', value: 'fill'},
  {title: 'Outline', value: 'outline'},
  {title: 'Text', value: 'text'},
  {title: 'Circle', value: 'circle'},
  {title: 'White', value: 'white'},
]

const hoverEffectOptions = [
  {title: 'Text flip', value: 'text-flip'},
  {title: 'Creative fill', value: 'creative-fill'},
  {title: 'Magnetic', value: 'magnetic'},
  {title: 'Magnetic text flip', value: 'magnetic-text-flip'},
]

export const globalButton = defineType({
  name: 'globalButton',
  title: 'Global button',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required().max(2048),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {list: buttonOptions},
    }),
    defineField({
      name: 'hoverEffect',
      title: 'Hover effect',
      type: 'string',
      options: {list: hoverEffectOptions},
    }),
    defineField({name: 'rel', title: 'Rel', type: 'string'}),
    defineField({
      name: 'target',
      title: 'Target',
      type: 'string',
      options: {
        list: [
          {title: 'Same tab', value: '_self'},
          {title: 'New tab', value: '_blank'},
        ],
      },
    }),
  ],
})

export const globalBrand = defineType({
  name: 'globalBrand',
  title: 'Brand',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'logoPath',
      title: 'Logo path',
      type: 'string',
      validation: (Rule) => Rule.required().max(2048),
    }),
    defineField({
      name: 'logoAlternatePath',
      title: 'Alternate logo path',
      type: 'string',
      validation: (Rule) => Rule.max(2048),
    }),
    defineField({name: 'logoText', title: 'Logo text', type: 'string'}),
    defineField({name: 'logoWidth', title: 'Logo width', type: 'string'}),
    defineField({name: 'logoHeight', title: 'Logo height', type: 'string'}),
  ],
})

export const globalContact = defineType({
  name: 'globalContact',
  title: 'Global contact',
  type: 'object',
  fields: [
    defineField({
      name: 'addressText',
      title: 'Address',
      type: 'string',
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Phone label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'phoneHref',
      title: 'Phone link',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email label',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'emailHref',
      title: 'Email link',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({name: 'mapEmbedUrl', title: 'Map embed URL', type: 'url'}),
  ],
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

export const navigationChildItem = defineType({
  name: 'navigationChildItem',
  title: 'Navigation child item',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'name',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required().max(2048),
    }),
    defineField({name: 'weight', title: 'Weight', type: 'number'}),
    defineField({name: 'rel', title: 'Rel', type: 'string'}),
    defineField({name: 'target', title: 'Target', type: 'string'}),
  ],
})

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'name',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({name: 'url', title: 'URL', type: 'string', validation: (Rule) => Rule.max(2048)}),
    defineField({name: 'weight', title: 'Weight', type: 'number'}),
    defineField({name: 'rel', title: 'Rel', type: 'string'}),
    defineField({name: 'target', title: 'Target', type: 'string'}),
    defineField({
      name: 'children',
      title: 'Children',
      type: 'array',
      of: [defineArrayMember({type: 'navigationChildItem'})],
    }),
  ],
})

export const globalHeader = defineType({
  name: 'globalHeader',
  title: 'Global header',
  type: 'object',
  fields: [
    defineField({
      name: 'primaryNavigation',
      title: 'Primary navigation',
      type: 'array',
      of: [defineArrayMember({type: 'navigationItem'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'navigationButton', title: 'Navigation button', type: 'globalButton'}),
    defineField({
      name: 'topBar',
      title: 'Top bar',
      type: 'object',
      fields: [
        defineField({name: 'workingHoursLabel', title: 'Working hours label', type: 'string'}),
        defineField({name: 'workingHoursValue', title: 'Working hours value', type: 'string'}),
        defineField({name: 'callLabel', title: 'Call label', type: 'string'}),
        defineField({name: 'hotLineLabel', title: 'Hotline label', type: 'string'}),
        defineField({name: 'letsChatLabel', title: 'Lets chat label', type: 'string'}),
      ],
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement bar',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
        defineField({name: 'label', title: 'Label', type: 'text', rows: 2}),
      ],
    }),
    defineField({
      name: 'offcanvas',
      title: 'Offcanvas',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'button', title: 'Button', type: 'globalButton'}),
      ],
    }),
  ],
})

export const globalFooter = defineType({
  name: 'globalFooter',
  title: 'Global footer',
  type: 'object',
  fields: [
    defineField({
      name: 'primary',
      title: 'Primary footer',
      type: 'object',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'supportLabel', title: 'Support label', type: 'string'}),
        defineField({name: 'servicesHeading', title: 'Services heading', type: 'string'}),
        defineField({name: 'contactHeading', title: 'Contact heading', type: 'string'}),
        defineField({name: 'workHourLabel', title: 'Work hour label', type: 'string'}),
        defineField({name: 'workHourValue', title: 'Work hour value', type: 'string'}),
        defineField({name: 'sinceText', title: 'Since text', type: 'string'}),
        defineField({
          name: 'navigation',
          title: 'Navigation',
          type: 'array',
          of: [defineArrayMember({type: 'navigationChildItem'})],
        }),
      ],
    }),
    defineField({
      name: 'secondary',
      title: 'Secondary footer',
      type: 'object',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
        defineField({name: 'callUsLabel', title: 'Call us label', type: 'string'}),
        defineField({
          name: 'subscription',
          title: 'Subscription',
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'note', title: 'Note', type: 'text', rows: 2}),
            defineField({name: 'formAction', title: 'Form action', type: 'string'}),
            defineField({name: 'mailchimpTagValue', title: 'Mailchimp tag value', type: 'string'}),
            defineField({name: 'emailPlaceholder', title: 'Email placeholder', type: 'string'}),
            defineField({name: 'submitLabel', title: 'Submit label', type: 'string'}),
          ],
        }),
        defineField({
          name: 'navigation',
          title: 'Navigation',
          type: 'array',
          of: [defineArrayMember({type: 'navigationChildItem'})],
        }),
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
        defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
      ],
    }),
  ],
})

export const globalFaviconItem = defineType({
  name: 'globalFaviconItem',
  title: 'Favicon entry',
  type: 'object',
  fields: [
    defineField({name: 'rel', title: 'Rel', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'type', title: 'MIME type', type: 'string'}),
    defineField({name: 'sizes', title: 'Sizes', type: 'string'}),
    defineField({name: 'purpose', title: 'Purpose', type: 'string'}),
    defineField({name: 'color', title: 'Color (Safari pinned)', type: 'string'}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {
      rel: 'rel',
      sizes: 'sizes',
      alt: 'image.alt',
      media: 'image.image',
    },
    prepare({rel, sizes, alt, media}) {
      return {
        title: `${rel || 'icon'}${sizes ? ` (${sizes})` : ''}`,
        subtitle: alt,
        media,
      }
    },
  },
})

export const globalSeoDefaults = defineType({
  name: 'globalSeoDefaults',
  title: 'SEO defaults',
  type: 'object',
  fields: [
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'title', title: 'Fallback title', type: 'string'}),
    defineField({name: 'description', title: 'Fallback description', type: 'text', rows: 3}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'taglineSeparator', title: 'Tagline separator', type: 'string'}),
    defineField({name: 'baseUrl', title: 'Base URL', type: 'url'}),
    defineField({name: 'defaultImage', title: 'Default social image path', type: 'string'}),
    defineField({name: 'pageHeaderDefaultImage', title: 'Default page header image path', type: 'string'}),
    defineField({
      name: 'faviconSet',
      title: 'Favicon set',
      type: 'array',
      of: [defineArrayMember({type: 'globalFaviconItem'})],
      description: 'Browser/app favicons. Each entry renders a <link rel="..."> tag.',
    }),
    defineField({name: 'keywords', title: 'Default keywords', type: 'array', of: [defineArrayMember({type: 'string'})]}),
    defineField({name: 'robots', title: 'Default robots directive', type: 'string'}),
    defineField({name: 'ogLocale', title: 'Open Graph locale', type: 'string'}),
    defineField({name: 'ogType', title: 'Open Graph type', type: 'string'}),
    defineField({name: 'twitter', title: 'Twitter handle', type: 'string'}),
    defineField({name: 'twitterCard', title: 'Twitter card', type: 'string'}),
    defineField({name: 'themeColorLight', title: 'Theme color light', type: 'string'}),
    defineField({name: 'themeColorDark', title: 'Theme color dark', type: 'string'}),
    defineField({name: 'headContent', title: 'Custom head content', type: 'text', rows: 6}),
  ],
})

export const globalOrganization = defineType({
  name: 'globalOrganization',
  title: 'Organization',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'streetAddress', title: 'Street address', type: 'string'}),
    defineField({name: 'addressLocality', title: 'Address locality', type: 'string'}),
    defineField({name: 'addressRegion', title: 'Address region', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'telephone', title: 'Telephone', type: 'string'}),
    defineField({name: 'logo', title: 'Logo path', type: 'string'}),
  ],
})

export const globalIndexing = defineType({
  name: 'globalIndexing',
  title: 'Indexing',
  type: 'object',
  fields: [
    defineField({
      name: 'robotsTxt',
      title: 'Robots.txt',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
        defineField({name: 'disallow', title: 'Disallow paths', type: 'array', of: [defineArrayMember({type: 'string'})]}),
      ],
    }),
    defineField({
      name: 'sitemap',
      title: 'Sitemap',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
        defineField({name: 'exclude', title: 'Excluded path fragments', type: 'array', of: [defineArrayMember({type: 'string'})]}),
      ],
    }),
  ],
})

export const globalForms = defineType({
  name: 'globalForms',
  title: 'Forms',
  type: 'object',
  fields: [
    defineField({name: 'contactFormProvider', title: 'Contact form provider', type: 'string'}),
    defineField({name: 'contactFormAction', title: 'Contact form action', type: 'string'}),
    defineField({name: 'subscriptionFormAction', title: 'Subscription form action', type: 'string'}),
    defineField({name: 'mailchimpTagValue', title: 'Mailchimp tag value', type: 'string'}),
    defineField({
      name: 'messages',
      title: 'Form messages',
      type: 'object',
      fields: [
        defineField({name: 'missingAction', title: 'Missing action message', type: 'string'}),
        defineField({name: 'subscribeSuccess', title: 'Subscribe success fallback', type: 'string'}),
        defineField({name: 'subscribeError', title: 'Subscribe error fallback', type: 'string'}),
        defineField({name: 'subscribeNetworkError', title: 'Subscribe network error fallback', type: 'string'}),
      ],
    }),
  ],
})

export const globalAppManifest = defineType({
  name: 'globalAppManifest',
  title: 'App manifest',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'shortName', title: 'Short name', type: 'string'}),
    defineField({name: 'themeColor', title: 'Theme color', type: 'string'}),
    defineField({name: 'backgroundColor', title: 'Background color', type: 'string'}),
    defineField({name: 'display', title: 'Display', type: 'string'}),
    defineField({
      name: 'icons',
      title: 'Icons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'sizes', title: 'Sizes', type: 'string'}),
            defineField({name: 'type', title: 'Type', type: 'string'}),
            defineField({name: 'purpose', title: 'Purpose', type: 'string'}),
            defineField({name: 'image', title: 'Image', type: 'imageWithAlt', validation: (Rule) => Rule.required()}),
          ],
        }),
      ],
    }),
  ],
})

export const globalUiCopy = defineType({
  name: 'globalUiCopy',
  title: 'UI copy',
  type: 'object',
  fields: [
    defineField({name: 'copy', title: 'Copy JSON', type: 'text', rows: 30}),
  ],
})

export const siteGlobals = defineType({
  name: 'siteGlobals',
  title: 'Site globals',
  type: 'document',
  fields: [
    defineField({name: 'brand', title: 'Brand', type: 'globalBrand'}),
    defineField({name: 'contact', title: 'Contact', type: 'globalContact'}),
    defineField({name: 'header', title: 'Header', type: 'globalHeader'}),
    defineField({name: 'footer', title: 'Footer', type: 'globalFooter'}),
    defineField({name: 'seoDefaults', title: 'SEO defaults', type: 'globalSeoDefaults'}),
    defineField({name: 'organization', title: 'Organization', type: 'globalOrganization'}),
    defineField({name: 'indexing', title: 'Indexing', type: 'globalIndexing'}),
    defineField({name: 'forms', title: 'Forms', type: 'globalForms'}),
    defineField({name: 'uiCopy', title: 'UI copy', type: 'globalUiCopy'}),
    defineField({name: 'appManifest', title: 'App manifest', type: 'globalAppManifest'}),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site globals'}
    },
  },
})
