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
    validation: (Rule) => Rule.max(2048),
  }),
  defineField({
    name: 'tag',
    title: 'Element type',
    type: 'string',
    options: {
      list: [
        {title: 'Link', value: 'a'},
        {title: 'Button', value: 'button'},
      ],
    },
  }),
  defineField({
    name: 'buttonType',
    title: 'Button type',
    type: 'string',
    options: {
      list: [
        {title: 'Button', value: 'button'},
        {title: 'Submit', value: 'submit'},
        {title: 'Reset', value: 'reset'},
      ],
    },
  }),
  defineField({
    name: 'title',
    title: 'Title attribute',
    type: 'string',
  }),
  defineField({
    name: 'rel',
    title: 'Rel',
    type: 'string',
  }),
  defineField({
    name: 'target',
    title: 'Target',
    type: 'string',
  }),
  defineField({
    name: 'icon',
    title: 'Icon',
    type: 'object',
    fields: [
      defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
      defineField({name: 'name', title: 'Icon name', type: 'string'}),
      defineField({
        name: 'position',
        title: 'Position',
        type: 'string',
        options: {
          list: [
            {title: 'Left', value: 'left'},
            {title: 'Right', value: 'right'},
          ],
        },
      }),
      defineField({name: 'className', title: 'Class name', type: 'string'}),
      defineField({name: 'size', title: 'Size', type: 'string'}),
    ],
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
    defineField({name: 'aboutSectionTwo', title: 'About section two', type: 'aboutContentSection'}),
    defineField({name: 'aboutMetricsSection', title: 'About metrics section', type: 'aboutContentSection'}),
    defineField({name: 'statsSection', title: 'Stats section', type: 'statsSection'}),
    defineField({name: 'statsMarqueeSection', title: 'Stats marquee section', type: 'statsMarqueeSection'}),
    defineField({name: 'teamSection', title: 'Team section', type: 'teamSection'}),
    defineField({name: 'testimonialSection', title: 'Testimonial section', type: 'testimonialSection'}),
    defineField({name: 'testimonialSectionTwo', title: 'Testimonial section two', type: 'testimonialSection'}),
    defineField({name: 'faqSection', title: 'FAQ section', type: 'faqSection'}),
    defineField({name: 'faqSectionTwo', title: 'FAQ section two', type: 'faqSection'}),
    defineField({name: 'contactSection', title: 'Contact section', type: 'contactSection'}),
    defineField({name: 'contactSectionTwo', title: 'Contact section two', type: 'contactSection'}),
    defineField({name: 'ctaGallerySection', title: 'CTA gallery section', type: 'ctaGallerySection'}),
    defineField({name: 'ctaVideoSection', title: 'CTA video section', type: 'ctaVideoSection'}),
    defineField({name: 'ctaVideoSectionTwo', title: 'CTA video section two', type: 'ctaVideoSection'}),
    defineField({name: 'ctaBarSection', title: 'CTA bar section', type: 'ctaBarSection'}),
    defineField({name: 'heroSectionTwo', title: 'Hero section two', type: 'heroSectionTwo'}),
    defineField({name: 'socialBarSection', title: 'Social bar section', type: 'socialBarSection'}),
    defineField({name: 'brandLogos', title: 'Brand logos', type: 'brandLogosSection'}),
    defineField({name: 'pricingSection', title: 'Pricing section', type: 'pricingSection'}),
    defineField({name: 'caseStudiesSection', title: 'Case studies section', type: 'caseStudiesSection'}),
    defineField({name: 'blogSection', title: 'Blog section', type: 'blogSection'}),
    defineField({name: 'blogSectionTwo', title: 'Blog section two', type: 'blogSection'}),
  ],
  preview: {
    prepare() {
      return {title: 'Reusable components'}
    },
  },
})
