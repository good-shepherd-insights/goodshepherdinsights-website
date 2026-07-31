import {defineArrayMember, defineField, defineType} from 'sanity'

const serviceIconOptions = [
  {title: 'Expert', value: '/images/icons/svg/expert.svg'},
  {title: 'Analysis', value: '/images/icons/svg/analysis.svg'},
  {title: '24 Hours Support', value: '/images/icons/svg/24-hours-support.svg'},
  {title: 'Business and Finance', value: '/images/icons/svg/business-and-finance.svg'},
  {title: 'Schedule', value: '/images/icons/svg/schedule.svg'},
  {title: 'Badge', value: '/images/icons/svg/badge.svg'},
]

export const serviceFeatureGridSection = defineType({
  name: 'serviceFeatureGridSection',
  title: 'Service Feature Grid Section',
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
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'cardLayout',
      title: 'Card layout',
      type: 'string',
      options: {
        list: [
          {title: 'Outside icon', value: 'outsideIcon'},
          {title: 'Inside icon', value: 'insideIcon'},
          {title: 'Outside icon square', value: 'outsideIconSquare'},
        ],
      },
      initialValue: 'outsideIconSquare',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: serviceIconOptions},
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(360),
            }),
          ],
        }),
      ],
    }),
  ],
})

export const serviceStatsMarqueeSection = defineType({
  name: 'serviceStatsMarqueeSection',
  title: 'Service Stats Marquee Section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
    defineField({name: 'shapeImage', title: 'Shape image', type: 'imageWithAlt'}),
    defineField({
      name: 'marquee',
      title: 'Marquee',
      type: 'object',
      fields: [
        defineField({
          name: 'elementWidthAuto',
          title: 'Element width auto',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'pauseOnHover',
          title: 'Pause on hover',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'reverse',
          title: 'Reverse',
          type: 'string',
          options: {
            list: [
              {title: 'Normal', value: ''},
              {title: 'Reverse', value: 'reverse'},
            ],
          },
        }),
        defineField({name: 'duration', title: 'Duration', type: 'string', initialValue: '90s'}),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'string',
          validation: (Rule) => Rule.required().max(300),
        }),
      ],
    }),
  ],
})

export const serviceProcessSection = defineType({
  name: 'serviceProcessSection',
  title: 'Service Process Section',
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
    defineField({
      name: 'services',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required().max(120),
            }),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {list: serviceIconOptions},
            }),
          ],
        }),
      ],
    }),
  ],
})

export const serviceCtaVideoSection = defineType({
  name: 'serviceCtaVideoSection',
  title: 'Service CTA Video Section',
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
      validation: (Rule) => Rule.max(180),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
    defineField({name: 'scribbleArrow', title: 'Scribble arrow', type: 'string'}),
    defineField({name: 'scribbleArrowAlt', title: 'Scribble arrow alt text', type: 'string'}),
    defineField({name: 'button', title: 'Button', type: 'reusableButton'}),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      fields: [
        defineField({
          name: 'src',
          title: 'Video ID or URL',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
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
        defineField({name: 'id', title: 'Modal ID', type: 'string'}),
        defineField({name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: true}),
      ],
    }),
  ],
})

export const serviceFaqSection = defineType({
  name: 'serviceFaqSection',
  title: 'Service FAQ Section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: false}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: 'list',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({
              name: 'title',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
})

export const serviceIndex = defineType({
  name: 'serviceIndex',
  title: 'Services Page',
  type: 'document',
  groups: [
    {name: 'index', title: 'Services index', default: true},
    {name: 'detail', title: 'Service detail pages'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'badge', title: 'Badge', type: 'string', group: 'index'}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'index',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'excerpt',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'index',
      validation: (Rule) => Rule.required().max(360),
    }),
    defineField({name: 'heroImage', title: 'Hero image', type: 'imageWithAlt', group: 'index'}),
    defineField({
      name: 'servicesList',
      title: 'Services list',
      type: 'object',
      group: 'index',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
        defineField({
          name: 'layout',
          title: 'Card layout',
          type: 'string',
          options: {
            list: [
              {title: 'List with image', value: 'listImage'},
              {title: 'Horizontal', value: 'horizontal'},
            ],
          },
          initialValue: 'listImage',
        }),
        defineField({
          name: 'limit',
          title: 'Limit',
          type: 'number',
          validation: (Rule) => Rule.integer().min(1),
        }),
      ],
    }),
    defineField({
      name: 'featureGrid',
      title: 'Feature grid',
      type: 'serviceFeatureGridSection',
      group: 'index',
    }),
    defineField({
      name: 'statsMarquee',
      title: 'Stats marquee',
      type: 'serviceStatsMarqueeSection',
      group: 'index',
    }),
    defineField({
      name: 'processSection',
      title: 'Process section',
      type: 'serviceProcessSection',
      group: 'index',
    }),
    defineField({
      name: 'ctaVideoSection',
      title: 'CTA video section',
      type: 'serviceCtaVideoSection',
      group: 'index',
    }),
    defineField({
      name: 'ctaSection',
      title: 'CTA section',
      type: 'reusableCtaSection',
      group: 'detail',
    }),
    defineField({
      name: 'faqSection',
      title: 'FAQ section',
      type: 'serviceFaqSection',
      group: 'detail',
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', media: 'heroImage.image'},
    prepare({title, media}) {
      return {title: title || 'Services Page', media}
    },
  },
})
