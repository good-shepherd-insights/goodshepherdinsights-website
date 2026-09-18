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
  title: 'Service Intro',
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
  title: 'Service Narrative',
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
  title: 'Stat Callout',
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
  title: 'Service Offering',
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

const serviceFitRole = defineArrayMember({
  name: 'role',
  title: 'Role',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Role label',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'owns',
      title: 'What this role owns in the decision',
      type: 'string',
      validation: (Rule) => Rule.required().max(240),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'owns',
    },
  },
})

const serviceProcessPhase = defineArrayMember({
  name: 'phase',
  title: 'Phase',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Phase name',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'What happens in this phase',
      type: 'string',
      validation: (Rule) => Rule.required().max(400),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
})

export const serviceProcess = defineType({
  name: 'serviceProcess',
  title: 'Service Process',
  description:
    'Defined engagement process. Row positions are fixed: phases, then client inputs, then outputs. The CTA button reuses the serviceCta block in the same body.',
  type: 'object',
  fields: [
    defineField({
      name: 'processTitle',
      title: 'Heading',
      type: 'string',
      initialValue: 'How the Engagement Works',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: 'Intro sentence',
      description: 'One sentence on how the engagement is run.',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'phases',
      title: 'Engagement phases',
      description: 'Ordered phases of the engagement — what happens in each.',
      type: 'array',
      of: [serviceProcessPhase],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'clientInputs',
      title: 'What we need from you',
      description: 'Inputs required from the client across the engagement.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) => Rule.required().max(200),
        }),
      ],
    }),
    defineField({
      name: 'outputs',
      title: 'What you get',
      description: 'Outputs produced by the service provider.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'output',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required().max(80),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              validation: (Rule) => Rule.max(300),
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'description'},
          },
        }),
      ],
    }),
    defineField({
      name: 'timing',
      title: 'Timing guidance',
      description: 'Decision points, dependencies, and timing — only when verified.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'variant',
      title: 'Layout variant',
      type: 'string',
      options: {
        list: [
          {title: 'Base (approved)', value: 'base'},
          {title: 'Compact needs (2-col checklist)', value: 'compactNeeds'},
          {title: 'Dense (no divider on outputs)', value: 'dense'},
        ],
        layout: 'radio',
      },
      initialValue: 'base',
    }),
  ],
  preview: {
    select: {
      title: 'processTitle',
      variant: 'variant',
    },
    prepare({title, variant}) {
      return {
        title: title || 'Service process',
        subtitle: variant ? `Engagement process — ${variant}` : 'Engagement process',
      }
    },
  },
})

export const serviceFit = defineType({
  name: 'serviceFit',
  title: 'Service Fit',
  description:
    'Audience and fit qualification. The CTA button reuses the serviceCta block in the same body.',
  type: 'object',
  fields: [
    defineField({
      name: 'fitTitle',
      title: 'Heading',
      type: 'string',
      initialValue: 'Who This Is For',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: 'Intro sentence',
      description: 'One sentence on why this section exists.',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'fit',
      title: 'Good-fit situations',
      description: 'Concrete conditions the buyer will recognize in their own operation.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) => Rule.required().max(200),
        }),
      ],
    }),
    defineField({
      name: 'roles',
      title: 'Buyer roles in the decision',
      type: 'array',
      of: [serviceFitRole],
    }),
    defineField({
      name: 'context',
      title: 'Context',
      description: 'Organizational / operational / technical context line.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: 'nonFit',
      title: 'Non-fit conditions',
      description: 'Explicit conditions where a church should not engage.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) => Rule.required().max(200),
        }),
      ],
    }),
    defineField({
      name: 'variant',
      title: 'Layout variant',
      type: 'string',
      options: {
        list: [
          {title: 'Styled (asymmetric split)', value: 'styled'},
          {title: 'Columns (bordered card)', value: 'columns'},
          {title: 'Ledger (numbered rows)', value: 'ledger'},
        ],
        layout: 'radio',
      },
      initialValue: 'styled',
    }),
  ],
  preview: {
    select: {
      title: 'fitTitle',
      variant: 'variant',
    },
    prepare({title, variant}) {
      return {
        title: title || 'Service fit',
        subtitle: variant ? `Fit qualification — ${variant}` : 'Fit qualification',
      }
    },
  },
})

export const serviceImage = defineType({
  name: 'serviceImage',
  title: 'Service Image',
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
