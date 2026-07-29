import {defineArrayMember, defineField, defineType} from 'sanity'
import {characterCount} from '../components/CharacterCountInput'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Article headline',
      type: 'string',
      description: 'On-page H1 and BlogPosting headline. Max 140 characters.',
      components: {input: characterCount(140)},
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
      title: 'First published date',
      type: 'datetime',
      description: 'Required. Emits datePublished and article:published_time.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Article summary',
      type: 'text',
      description: 'Listing summary and SEO fallback. Max 320 characters.',
      rows: 3,
      components: {input: characterCount(320)},
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: 'author',
      title: 'Article author',
      type: 'object',
      description: 'Displayed author and BlogPosting.author.',
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: 'name',
          title: 'Author name',
          type: 'string',
          description: 'Name only; no roles or prefixes.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'url',
          title: 'Author profile URL',
          type: 'url',
          description: 'Optional author identity URL.',
        }),
        defineField({
          name: 'sameAs',
          title: 'sameAs',
          type: 'array',
          description: 'Author identity URLs for JSON-LD author.sameAs.',
          of: [defineArrayMember({type: 'url'})],
          validation: (Rule) => Rule.unique(),
        }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Primary article image',
      type: 'image',
      description: 'Default page, social, and JSON-LD image; crops generate 16:9, 4:3, and 1:1.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Image alt text',
          type: 'string',
          description: 'Describe the meaningful image content.',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Metadata, Open Graph, and BlogPosting JSON-LD.',
      fieldsets: [
        {name: 'metadata', title: 'Metadata'},
        {name: 'openGraph', title: 'Open Graph'},
        {name: 'jsonLd', title: 'JSON-LD'},
      ],
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'metaTitle',
          type: 'string',
          fieldset: 'metadata',
          description: 'HTML <title> source. Target 50-60 characters; max 70.',
          components: {input: characterCount(70, '50-60')},
          validation: (Rule) => Rule.max(70),
        }),
        defineField({
          name: 'metaDescription',
          title: 'metaDescription',
          type: 'text',
          fieldset: 'metadata',
          description: 'Search/social/schema description. Target 150-160 characters; max 170.',
          rows: 3,
          components: {input: characterCount(170, '150-160')},
          validation: (Rule) => Rule.max(170),
        }),
        defineField({
          name: 'canonical',
          title: 'Canonical URL',
          type: 'url',
          fieldset: 'metadata',
          description: 'Absolute preferred URL. Leave blank unless overriding the article URL.',
        }),
        defineField({
          name: 'robots',
          title: 'Robots meta tag',
          type: 'string',
          fieldset: 'metadata',
          description: 'Indexing control. Use noindex only to hide from search.',
          initialValue: 'index, follow',
          options: {
            list: [
              {title: 'Index, follow', value: 'index, follow'},
              {title: 'Noindex, follow', value: 'noindex, follow'},
              {title: 'Noindex, nofollow', value: 'noindex, nofollow'},
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'snippetFocus',
          title: 'Snippet focus',
          type: 'string',
          fieldset: 'metadata',
          description: 'Internal target query or search intent. Not emitted.',
          components: {input: characterCount(120)},
          validation: (Rule) => Rule.max(120),
        }),
        defineField({
          name: 'keywords',
          title: 'keywords',
          type: 'array',
          fieldset: 'jsonLd',
          description: 'BlogPosting keywords; tags are added.',
          of: [
            defineArrayMember({
              type: 'string',
              title: 'Keyword or topic',
            }),
          ],
          options: {layout: 'tags'},
          validation: (Rule) => Rule.unique(),
        }),
        defineField({
          name: 'articleSection',
          title: 'articleSection',
          type: 'string',
          fieldset: 'jsonLd',
          description: 'Overrides the primary category in BlogPosting.articleSection.',
          components: {input: characterCount(80)},
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'about',
          title: 'about',
          type: 'array',
          fieldset: 'jsonLd',
          description: 'Primary topics/entities for BlogPosting.about.',
          of: [defineArrayMember({type: 'schemaThing'})],
        }),
        defineField({
          name: 'mentions',
          title: 'mentions',
          type: 'array',
          fieldset: 'jsonLd',
          description: 'Entities referenced by the article for BlogPosting.mentions.',
          of: [defineArrayMember({type: 'schemaThing'})],
        }),
        defineField({
          name: 'dateModified',
          title: 'dateModified',
          type: 'datetime',
          fieldset: 'jsonLd',
          description: 'BlogPosting dateModified and article:modified_time.',
        }),
        defineField({
          name: 'social',
          title: 'Open Graph',
          type: 'object',
          fieldset: 'openGraph',
          description: 'Optional og:* and Twitter card overrides.',
          fields: [
            defineField({
              name: 'title',
              title: 'og:title',
              type: 'string',
              description: 'Overrides og:title and twitter:title. Max 95 characters.',
              components: {input: characterCount(95)},
              validation: (Rule) => Rule.max(95),
            }),
            defineField({
              name: 'description',
              title: 'og:description',
              type: 'text',
              description: 'Overrides social preview description. Max 200 characters.',
              rows: 2,
              components: {input: characterCount(200)},
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'image',
              title: 'og:image',
              type: 'image',
              description: 'Overrides og:image and twitter:image. Prefer 1200x630 framing.',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Image alt text',
                  type: 'string',
                  description: 'Alt text for the social image.',
                }),
              ],
            }),
            defineField({
              name: 'imageAlt',
              title: 'og:image:alt',
              type: 'string',
              description: 'Overrides alt text for the Open Graph image.',
              components: {input: characterCount(160)},
              validation: (Rule) => Rule.max(160),
            }),
          ],
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
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const document = context.document as {_id?: string; draft?: boolean} | undefined
          const isDraftDocument = document?._id?.startsWith('drafts.')
          const isMarkedDraft = document?.draft === true

          if (isDraftDocument || isMarkedDraft) return true
          return Array.isArray(value) && value.length > 0 ? true : 'Required'
        }),
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
    defineField({
      name: 'comments',
      title: 'Comments',
      type: 'number',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'commentList',
      title: 'Comment list',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'avatar', title: 'Avatar', type: 'string'}),
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'date',
              title: 'Date',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }),
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
