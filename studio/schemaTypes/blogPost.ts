import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 120},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'metaTitle', title: 'SEO title', type: 'string'}),
    defineField({name: 'metaDescription', title: 'SEO description', type: 'text', rows: 3}),
    defineField({name: 'keywords', title: 'SEO keywords', type: 'array', of: [{type: 'string'}]}),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Article content',
      type: 'array',
      of: [
        defineArrayMember({type: 'articleSection'}),
        defineArrayMember({type: 'articleList'}),
        defineArrayMember({
          name: 'bodyImage',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
        defineArrayMember({
          name: 'divider',
          title: 'Divider',
          type: 'object',
          fields: [
            defineField({
              name: 'style',
              type: 'string',
              hidden: true,
              initialValue: 'solid',
            }),
          ],
        }),
        defineArrayMember({type: 'tldr'}),
        defineArrayMember({type: 'insightList'}),
        defineArrayMember({type: 'callout'}),
        defineArrayMember({type: 'takeaways'}),
        defineArrayMember({type: 'tableOfContents'}),
        defineArrayMember({type: 'faq'}),
        defineArrayMember({type: 'sources'}),
        defineArrayMember({type: 'framework'}),
        defineArrayMember({type: 'vendorProfile'}),
        defineArrayMember({type: 'useCase'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      validation: (Rule) => Rule.unique(),
    }),
    defineField({name: 'comments', title: 'Comments', type: 'number', validation: (Rule) => Rule.integer().min(0)}),
    defineField({
      name: 'commentList',
      title: 'Comment list',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'avatar', title: 'Avatar', type: 'string'}),
            defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'date', title: 'Date', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'content', title: 'Content', type: 'text', validation: (Rule) => Rule.required()}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'draft',
      title: 'Draft',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'excludeFromSitemap',
      title: 'Exclude from sitemap',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({title, publishedAt, media}) {
      return {
        title,
        subtitle: publishedAt?.slice(0, 10),
        media,
      }
    },
  },
})
