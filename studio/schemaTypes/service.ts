import {defineArrayMember, defineField, defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {source: 'title', maxLength: 120},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'settings',
      validation: (Rule) => Rule.integer().min(0),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required().max(320),
    }),
    defineField({
      name: 'serviceType',
      title: 'Service type',
      type: 'string',
      group: 'content',
      initialValue: 'Consulting Service',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'schema',
      title: 'Service JSON-LD',
      type: 'object',
      group: 'seo',
      description: 'Optional structured-data facts emitted in Service JSON-LD when populated.',
      fields: [
        defineField({
          name: 'areaServed',
          title: 'Areas served',
          type: 'array',
          description: 'Places, regions, or countries this service is offered to.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(120),
                }),
                defineField({
                  name: 'type',
                  title: 'Schema type',
                  type: 'string',
                  initialValue: 'Place',
                  options: {
                    list: [
                      {title: 'Place', value: 'Place'},
                      {title: 'City', value: 'City'},
                      {title: 'State', value: 'State'},
                      {title: 'Country', value: 'Country'},
                      {title: 'Administrative Area', value: 'AdministrativeArea'},
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: 'audience',
          title: 'Audience',
          type: 'array',
          description: 'Audience segments this service is intended for.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                  validation: (Rule) => Rule.required().max(120),
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: 'serviceOutput',
          title: 'Service output',
          type: 'string',
          description: 'Primary result or deliverable produced by this service.',
          validation: (Rule) => Rule.max(240),
        }),
        defineField({
          name: 'offers',
          title: 'Offers',
          type: 'array',
          description: 'Named service offers or packages available for this service.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                  validation: (Rule) => Rule.max(120),
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2,
                  validation: (Rule) => Rule.max(240),
                }),
                defineField({
                  name: 'url',
                  title: 'URL',
                  type: 'url',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Service content',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'serviceIntro'}),
        defineArrayMember({type: 'serviceNarrative'}),
        defineArrayMember({type: 'statCallout'}),
        defineArrayMember({type: 'serviceOffering'}),
        defineArrayMember({type: 'serviceCta'}),
        defineArrayMember({type: 'serviceImage'}),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoFields',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      media: 'heroImage.image',
    },
    prepare({title, status, media}) {
      return {
        title,
        subtitle: status === 'published' ? 'Published' : 'Draft',
        media,
      }
    },
  },
})
