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

export const siteGlobals = defineType({
  name: 'siteGlobals',
  title: 'Site globals',
  type: 'document',
  fields: [
    defineField({name: 'brand', title: 'Brand', type: 'globalBrand'}),
    defineField({name: 'contact', title: 'Contact', type: 'globalContact'}),
    defineField({name: 'header', title: 'Header', type: 'globalHeader'}),
    defineField({name: 'footer', title: 'Footer', type: 'globalFooter'}),
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
