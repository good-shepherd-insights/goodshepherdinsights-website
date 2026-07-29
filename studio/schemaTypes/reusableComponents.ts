import {defineField, defineType} from 'sanity'

const buttonFields = [
  defineField({
    name: 'enable',
    title: 'Enable',
    type: 'boolean',
    initialValue: true,
  }),
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
    options: {
      list: [
        {title: 'Fill', value: 'fill'},
        {title: 'Outline', value: 'outline'},
        {title: 'Text', value: 'text'},
        {title: 'Circle', value: 'circle'},
        {title: 'White', value: 'white'},
      ],
    },
  }),
  defineField({
    name: 'hoverEffect',
    title: 'Hover effect',
    type: 'string',
    options: {
      list: [
        {title: 'Text flip', value: 'text-flip'},
        {title: 'Creative fill', value: 'creative-fill'},
        {title: 'Magnetic', value: 'magnetic'},
        {title: 'Magnetic text flip', value: 'magnetic-text-flip'},
      ],
    },
  }),
]

export const reusableButton = defineType({
  name: 'reusableButton',
  title: 'Button',
  type: 'object',
  fields: buttonFields,
})

export const reusableCtaSection = defineType({
  name: 'reusableCtaSection',
  title: 'CTA section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'backgroundImage', title: 'Background image', type: 'imageWithAlt'}),
    defineField({name: 'humanImage', title: 'Human image', type: 'imageWithAlt'}),
    defineField({name: 'button', title: 'Button', type: 'reusableButton'}),
  ],
})

export const reusableComponents = defineType({
  name: 'reusableComponents',
  title: 'Reusable components',
  type: 'document',
  fields: [
    defineField({
      name: 'ctaSection',
      title: 'Default CTA section',
      type: 'reusableCtaSection',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Reusable components'}
    },
  },
})
