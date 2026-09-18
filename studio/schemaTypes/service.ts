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
      name: 'hero',
      title: 'Service hero',
      description:
        'Five hero elements rendered by the ServiceHero component (shown under the page title). Buyer, problem and promise have no fallbacks — leave a field empty and that block is skipped.',
      type: 'object',
      group: 'content',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          description:
            'Overrides the excerpt in the hero. Keep it under 60 characters so it stays on two lines at display size.',
          type: 'string',
          validation: (Rule) => Rule.max(90),
        }),
        defineField({
          name: 'buyer',
          title: 'Target buyer',
          description:
            'Who this service is for. Separate paragraphs with a blank line.',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'problem',
          title: 'Triggering problem',
          description:
            'The specific problem that makes someone look for this service. Separate paragraphs with a blank line.',
          type: 'text',
          rows: 6,
        }),
        defineField({
          name: 'promise',
          title: 'Service promise',
          description:
            'What Good Shepherd Insights commits to do. Separate paragraphs with a blank line.',
          type: 'text',
          rows: 6,
        }),
        defineField({
          name: 'outcome',
          title: 'Concrete outcome',
          description:
            'What the buyer walks away with. Falls back to the serviceCta text in the body when empty.',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'variant',
          title: 'Hero variant',
          type: 'string',
          options: {
            list: [
              {title: 'Columns (light)', value: 'columns'},
              {title: 'Inset (dark panel)', value: 'inset'},
              {title: 'Band (full-bleed)', value: 'band'},
            ],
            layout: 'radio',
          },
          initialValue: 'band',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Service content',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'serviceIntro'}),
        defineArrayMember({type: 'serviceFit'}),
        defineArrayMember({type: 'serviceProcess'}),
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
