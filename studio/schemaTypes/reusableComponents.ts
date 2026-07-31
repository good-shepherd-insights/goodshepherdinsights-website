import {defineField, defineType} from 'sanity'
import {buttonHoverEffectOptions, buttonVariantOptions} from './shared'

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
    options: {list: buttonVariantOptions},
  }),
  defineField({
    name: 'hoverEffect',
    title: 'Hover effect',
    type: 'string',
    options: {list: buttonHoverEffectOptions},
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
  title: 'CTA Section',
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

const defaultDocument = (name: string, title: string, contentType: string) =>
  defineType({
    name,
    title,
    type: 'document',
    fields: [defineField({name: 'content', title: 'Content', type: contentType})],
    preview: {
      prepare() {
        return {title}
      },
    },
  })

export const defaultAboutSectionTwo = defaultDocument(
  'defaultAboutSectionTwo',
  'About Section Two (Default)',
  'aboutContentSection',
)

export const defaultAboutMetricsSection = defaultDocument(
  'defaultAboutMetricsSection',
  'About Metrics Section (Default)',
  'aboutContentSection',
)

export const defaultStatsSection = defaultDocument(
  'defaultStatsSection',
  'Stats Section (Default)',
  'statsSection',
)

export const defaultStatsMarqueeSection = defaultDocument(
  'defaultStatsMarqueeSection',
  'Stats Marquee Section (Default)',
  'statsMarqueeSection',
)

export const defaultTeamSection = defaultDocument(
  'defaultTeamSection',
  'Team Section (Default)',
  'teamSection',
)

export const defaultTestimonialSection = defaultDocument(
  'defaultTestimonialSection',
  'Testimonial Section (Default)',
  'testimonialSection',
)

export const defaultTestimonialSectionTwo = defaultDocument(
  'defaultTestimonialSectionTwo',
  'Testimonial Section Two (Default)',
  'testimonialSection',
)

export const defaultFaqSection = defaultDocument(
  'defaultFaqSection',
  'FAQ Section (Default)',
  'faqSection',
)

export const defaultFaqSectionTwo = defaultDocument(
  'defaultFaqSectionTwo',
  'FAQ Section Two (Default)',
  'faqSection',
)

export const defaultContactSection = defaultDocument(
  'defaultContactSection',
  'Contact Section (Default)',
  'contactSection',
)

export const defaultContactSectionTwo = defaultDocument(
  'defaultContactSectionTwo',
  'Contact Section Two (Default)',
  'contactSection',
)

export const defaultCtaGallerySection = defaultDocument(
  'defaultCtaGallerySection',
  'CTA Gallery Section (Default)',
  'ctaGallerySection',
)

export const defaultCtaVideoSection = defaultDocument(
  'defaultCtaVideoSection',
  'CTA Video Section (Default)',
  'ctaVideoSection',
)

export const defaultCtaVideoSectionTwo = defaultDocument(
  'defaultCtaVideoSectionTwo',
  'CTA Video Section Two (Default)',
  'ctaVideoSection',
)

export const defaultCtaBarSection = defaultDocument(
  'defaultCtaBarSection',
  'CTA Bar Section (Default)',
  'ctaBarSection',
)

export const defaultHeroSectionTwo = defaultDocument(
  'defaultHeroSectionTwo',
  'Hero Section Two (Default)',
  'heroSectionTwo',
)

export const defaultSocialBarSection = defaultDocument(
  'defaultSocialBarSection',
  'Social Bar Section (Default)',
  'socialBarSection',
)

export const defaultBrandLogos = defaultDocument(
  'defaultBrandLogos',
  'Brand Logos (Default)',
  'brandLogosSection',
)

export const defaultPricingSection = defaultDocument(
  'defaultPricingSection',
  'Pricing Section (Default)',
  'pricingSection',
)

export const defaultCaseStudiesSection = defaultDocument(
  'defaultCaseStudiesSection',
  'Case Studies Section (Default)',
  'caseStudiesSection',
)

export const defaultBlogSection = defaultDocument(
  'defaultBlogSection',
  'Blog Section (Default)',
  'blogSection',
)

export const defaultBlogSectionTwo = defaultDocument(
  'defaultBlogSectionTwo',
  'Blog Section Two (Default)',
  'blogSection',
)

export const defaultCtaSection = defaultDocument(
  'defaultCtaSection',
  'CTA Section (Default)',
  'reusableCtaSection',
)
