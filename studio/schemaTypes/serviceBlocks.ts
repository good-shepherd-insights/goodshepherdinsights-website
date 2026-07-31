import {defineArrayMember, defineField, defineType} from 'sanity'
import {previewPortableText} from './shared'

const textItem = defineArrayMember({
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'simplePortableText',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {text: 'text'},
    prepare({text}) {
      return {
        title: previewPortableText(text).slice(0, 100) || 'Text item',
      }
    },
  },
})

export const serviceIntro = defineType({
  name: 'serviceIntro',
  title: 'Service intro',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: 'text',
      title: 'Intro text',
      type: 'simplePortableText',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      text: 'text',
    },
    prepare({title, text}) {
      return {
        title: title || 'Service intro',
        subtitle: previewPortableText(text).slice(0, 100),
      }
    },
  },
})

export const serviceNarrative = defineType({
  name: 'serviceNarrative',
  title: 'Service narrative',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'simplePortableText',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      text: 'text',
    },
    prepare({title, text}) {
      return {
        title: title || 'Service narrative',
        subtitle: previewPortableText(text).slice(0, 100),
      }
    },
  },
})

export const statCallout = defineType({
  name: 'statCallout',
  title: 'Stat callout',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(180),
    }),
  ],
  preview: {
    select: {
      title: 'value',
      subtitle: 'label',
    },
  },
})

export const serviceOffering = defineType({
  name: 'serviceOffering',
  title: 'Service offering',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'simplePortableText',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'audience',
      title: 'Who this is for',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [textItem],
    }),
    defineField({
      name: 'methodologySteps',
      title: 'Methodology steps',
      type: 'array',
      of: [textItem],
    }),
    defineField({
      name: 'statCallouts',
      title: 'Stat callouts',
      type: 'array',
      of: [defineArrayMember({type: 'statCallout'})],
    }),
    defineField({
      name: 'outcomesTitle',
      title: 'Outcomes title',
      type: 'string',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [textItem],
    }),
  ],
  preview: {
    select: {
      number: 'number',
      title: 'title',
    },
    prepare({number, title}) {
      return {
        title: title || 'Service offering',
        subtitle: number ? `Offering ${number}` : undefined,
      }
    },
  },
})

export const serviceCta = defineType({
  name: 'serviceCta',
  title: 'Service CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'simplePortableText',
    }),
    defineField({
      name: 'linkText',
      title: 'Link text',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'href',
      title: 'Link URL',
      type: 'string',
      validation: (Rule) => Rule.required().max(2048),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'linkText',
    },
  },
})

export const serviceImage = defineType({
  name: 'serviceImage',
  title: 'Service image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      fields: [
        defineField({
          name: 'src',
          title: 'Video source',
          type: 'string',
          validation: (Rule) => Rule.required().max(2048),
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
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'youtube',
        }),
        defineField({
          name: 'id',
          title: 'Modal ID',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'image.alt',
      subtitle: 'image.caption',
      media: 'image.image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Service image',
        subtitle,
        media,
      }
    },
  },
})
