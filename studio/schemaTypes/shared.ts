import {defineArrayMember, defineField, defineType} from 'sanity'

export const buttonVariantOptions = [
  {title: 'Fill', value: 'fill'},
  {title: 'Outline', value: 'outline'},
  {title: 'Text', value: 'text'},
  {title: 'Circle', value: 'circle'},
  {title: 'White', value: 'white'},
]

export const buttonHoverEffectOptions = [
  {title: 'Text flip', value: 'text-flip'},
  {title: 'Creative fill', value: 'creative-fill'},
  {title: 'Magnetic', value: 'magnetic'},
  {title: 'Magnetic text flip', value: 'magnetic-text-flip'},
]

const linkAnnotation = defineArrayMember({
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
})

export const simplePortableText = defineType({
  name: 'simplePortableText',
  title: 'Simple Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [linkAnnotation],
      },
    }),
  ],
})

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (Rule) => Rule.max(240),
    }),
  ],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'caption',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Image',
        subtitle,
        media,
      }
    },
  },
})

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'SEO title',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: 'keywords',
      title: 'SEO keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      type: 'string',
      validation: (Rule) => Rule.max(2048),
    }),
    defineField({
      name: 'robots',
      title: 'Robots',
      type: 'string',
      options: {
        list: [
          {title: 'Index, follow', value: 'index, follow'},
          {title: 'Noindex, follow', value: 'noindex, follow'},
          {title: 'Noindex, nofollow', value: 'noindex, nofollow'},
        ],
        layout: 'radio',
      },
      initialValue: 'index, follow',
    }),
    defineField({
      name: 'excludeFromSitemap',
      title: 'Exclude from sitemap',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export const schemaThing = defineType({
  name: 'schemaThing',
  title: 'Thing',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'url',
      title: 'url',
      type: 'url',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'url'},
  },
})

export function previewPortableText(value?: Array<{children?: Array<{text?: string}>}>) {
  return (value || [])
    .flatMap((block) => (block.children || []).map((child) => child.text || ''))
    .join(' ')
    .trim()
}
