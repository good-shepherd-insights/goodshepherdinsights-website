import {defineArrayMember, defineField, defineType} from 'sanity'
import {previewPortableText} from './shared'

const inlineText = () =>
  defineArrayMember({
    type: 'block',
    styles: [{title: 'Normal', value: 'normal'}],
    lists: [],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required().max(2048),
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
      ],
    },
  })

const inlineTextField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [inlineText()],
    validation: (Rule) => Rule.required().min(1),
  })

const constrainedText = () =>
  defineArrayMember({
    type: 'block',
    styles: [{title: 'Normal', value: 'normal'}],
    lists: [
      {title: 'Bullet', value: 'bullet'},
      {title: 'Numbered', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required().max(2048),
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
      ],
    },
  })

export const tldr = defineType({
  name: 'tldr',
  title: 'TL;DR',
  type: 'object',
  fields: [inlineTextField('text', 'Summary')],
})

export const articleSection = defineType({
  name: 'articleSection',
  title: 'Article Section',
  type: 'object',
  fields: [
    defineField({
      name: 'header',
      title: 'Header',
      type: 'string',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'headerLevel',
      title: 'Header level',
      type: 'string',
      options: {
        list: [
          {title: 'Heading 2', value: 'h2'},
          {title: 'Heading 3', value: 'h3'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'h2',
      hidden: ({parent}) => !parent?.header,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {header?: string} | undefined
          return !parent?.header || value ? true : 'Required when header is set'
        }),
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [inlineText()],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'header',
      paragraphs: 'paragraphs',
    },
    prepare({title, paragraphs}) {
      return {
        title: title || 'Article section',
        subtitle: previewPortableText(paragraphs).slice(0, 100) || 'Paragraph section',
      }
    },
  },
})

export const articleList = defineType({
  name: 'articleList',
  title: 'Article List',
  type: 'object',
  fields: [
    defineField({
      name: 'header',
      title: 'Header',
      type: 'string',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'headerLevel',
      title: 'Header level',
      type: 'string',
      options: {
        list: [
          {title: 'Heading 2', value: 'h2'},
          {title: 'Heading 3', value: 'h3'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'h2',
      hidden: ({parent}) => !parent?.header,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {header?: string} | undefined
          return !parent?.header || value ? true : 'Required when header is set'
        }),
    }),
    defineField({
      name: 'style',
      title: 'List style',
      type: 'string',
      options: {
        list: [
          {title: 'Bulleted', value: 'bullet'},
          {title: 'Numbered', value: 'number'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'bullet',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'articleListItem',
          title: 'List item',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [inlineText()],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {text: 'text'},
            prepare({text}) {
              return {
                title: previewPortableText(text).slice(0, 100) || 'List item',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'header',
      style: 'style',
      items: 'items',
    },
    prepare({title, style, items}) {
      return {
        title: title || (style === 'number' ? 'Numbered list' : 'Bulleted list'),
        subtitle: `${items?.length || 0} items`,
      }
    },
  },
})

export const insightList = defineType({
  name: 'insightList',
  title: 'Insight List',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'insightItem',
          title: 'Insight item',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [inlineText()],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      options: {list: ['Key Point', 'Key Insight']},
      validation: (Rule) => Rule.required(),
    }),
    inlineTextField('text', 'Text'),
  ],
})

export const takeaways = defineType({
  name: 'takeaways',
  title: 'Takeaways',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'takeawayItem',
          title: 'Takeaway item',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [inlineText()],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'source',
          title: 'Source',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [constrainedText()],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {select: {title: 'question'}},
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export const tableOfContents = defineType({
  name: 'tableOfContents',
  title: 'Table of Contents',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Table of Contents',
      validation: (Rule) => Rule.required().max(80),
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'Table of Contents',
        subtitle: 'Auto-generated from article headings',
      }
    },
  },
})

export const sources = defineType({
  name: 'sources',
  title: 'Sources',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Sources',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'source',
          title: 'Source',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'url', title: 'URL', type: 'string'}),
            defineField({name: 'publisher', title: 'Publisher', type: 'string'}),
            defineField({name: 'publishedAt', title: 'Published at', type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'publisher'}},
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export const framework = defineType({
  name: 'framework',
  title: 'Framework',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'number',
              validation: (Rule) => Rule.required().integer().min(1),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'explanation',
              title: 'Explanation',
              type: 'array',
              of: [constrainedText()],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'number'}},
        }),
      ],
      validation: (Rule) => Rule.required().min(3),
    }),
  ],
})

export const vendorProfile = defineType({
  name: 'vendorProfile',
  title: 'Vendor Profile',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Vendor',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'officialLinks',
      title: 'Official links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'marketPosition',
      title: 'Market position',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bestFor',
      title: 'Best for',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coreStrengths',
      title: 'Core strengths',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'limitations',
      title: 'Limitations',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'selectionCriteria',
      title: 'Selection criteria',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})

export const useCase = defineType({
  name: 'useCase',
  title: 'Use Case',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'churchProfile',
      title: 'Church profile',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recommendation',
      title: 'Recommendation',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rationale',
      title: 'Rationale',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
