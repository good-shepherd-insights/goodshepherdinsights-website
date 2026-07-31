import {defineArrayMember, defineField, defineType} from 'sanity'

const serviceCardLayouts = [
  {title: 'Horizontal', value: 'horizontal'},
  {title: 'List with image', value: 'listImage'},
]

const blogCardLayouts = [
  {title: 'Grid', value: 'grid'},
  {title: 'Featured', value: 'featured'},
  {title: 'Horizontal', value: 'horizontal'},
  {title: 'Compact', value: 'compact'},
]

export const homeHeroSection = defineType({
  name: 'homeHeroSection',
  title: 'Hero section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'subTitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'titleLine1',
      title: 'Title line 1',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'titleLine2',
      title: 'Title line 2',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'arrowDecorationImage', title: 'Arrow decoration', type: 'imageWithAlt'}),
    defineField({name: 'shapeImage', title: 'Shape image', type: 'imageWithAlt'}),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({name: 'image', title: 'Image', type: 'imageWithAlt'})],
          preview: {
            select: {title: 'image.alt', media: 'image.image'},
          },
        }),
      ],
    }),
    defineField({
      name: 'satisfactionClients',
      title: 'Satisfaction clients',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: false}),
        defineField({
          name: 'avatars',
          title: 'Avatars',
          type: 'array',
          of: [defineArrayMember({type: 'imageWithAlt'})],
        }),
        defineField({name: 'avatarAlt', title: 'Shared avatar alt text', type: 'string'}),
        defineField({name: 'count', title: 'Count', type: 'string'}),
        defineField({name: 'label', title: 'Label', type: 'string'}),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      fields: [
        defineField({name: 'src', title: 'Video ID or URL', type: 'string'}),
        defineField({name: 'type', title: 'HTML5 video type', type: 'string'}),
        defineField({
          name: 'provider',
          title: 'Provider',
          type: 'string',
          options: {
            list: [
              {title: 'YouTube', value: 'youtube'},
              {title: 'Vimeo', value: 'vimeo'},
              {title: 'HTML5', value: 'html5'},
            ],
          },
          initialValue: 'youtube',
        }),
        defineField({name: 'poster', title: 'Poster image', type: 'imageWithAlt'}),
        defineField({name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: true}),
        defineField({name: 'id', title: 'Modal ID', type: 'string'}),
      ],
    }),
    defineField({
      name: 'helpDropdown',
      title: 'Help dropdown',
      type: 'object',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: false}),
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'url', title: 'URL', type: 'string'}),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

export const homeServicesSection = defineType({
  name: 'homeServicesSection',
  title: 'Services section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({name: 'button', title: 'Button', type: 'reusableButton'}),
    defineField({
      name: 'cardLayout',
      title: 'Card layout',
      type: 'string',
      options: {list: serviceCardLayouts},
      initialValue: 'horizontal',
    }),
    defineField({
      name: 'limit',
      title: 'Limit',
      type: 'number',
      validation: (Rule) => Rule.integer().min(1),
    }),
  ],
})

export const homeAboutSection = defineType({
  name: 'homeAboutSection',
  title: 'About section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'list',
      title: 'Content blocks',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({name: 'badge', title: 'Badge', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({
              name: 'services',
              title: 'Services or metrics',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'title', title: 'Title', type: 'string'}),
                    defineField({name: 'percent', title: 'Percent', type: 'string'}),
                  ],
                }),
              ],
            }),
            defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
            defineField({
              name: 'imageVerticalTitle',
              title: 'Image vertical title',
              type: 'string',
            }),
            defineField({
              name: 'leftImagePostion',
              title: 'Show image before text',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'badge', media: 'image.image'},
          },
        }),
      ],
    }),
  ],
})

export const homeBlogSection = defineType({
  name: 'homeBlogSection',
  title: 'Blog section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'options',
      title: 'Display options',
      type: 'object',
      fields: [
        defineField({
          name: 'layout',
          title: 'Layout',
          type: 'string',
          options: {list: blogCardLayouts},
          initialValue: 'grid',
        }),
        defineField({
          name: 'limit',
          title: 'Limit',
          type: 'number',
          validation: (Rule) => Rule.integer().min(1),
        }),
      ],
    }),
  ],
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {name: 'page', title: 'Page', default: true},
    {name: 'sections', title: 'Sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'page',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'pageType',
      title: 'Page type',
      type: 'string',
      group: 'page',
      initialValue: 'home',
    }),
    defineField({
      name: 'disableTagline',
      title: 'Disable tagline',
      type: 'boolean',
      group: 'page',
      initialValue: true,
    }),
    defineField({name: 'image', title: 'Social image', type: 'imageWithAlt', group: 'seo'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
    defineField({
      name: 'heroSection',
      title: 'Hero section',
      type: 'homeHeroSection',
      group: 'sections',
    }),
    defineField({
      name: 'servicesSection',
      title: 'Services section',
      type: 'homeServicesSection',
      group: 'sections',
    }),
    defineField({
      name: 'aboutSection',
      title: 'About section',
      type: 'homeAboutSection',
      group: 'sections',
    }),
    defineField({
      name: 'blogSection',
      title: 'Blog section',
      type: 'homeBlogSection',
      group: 'sections',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Homepage'}
    },
  },
})
