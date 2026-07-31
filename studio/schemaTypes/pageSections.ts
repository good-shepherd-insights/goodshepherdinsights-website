import {defineArrayMember, defineField, defineType} from 'sanity'

const buttonField = defineField({name: 'button', title: 'Button', type: 'reusableButton'})
const imagePathField = (name: string, title: string) =>
  defineField({name, title, type: 'string', validation: (Rule) => Rule.max(2048)})
const altField = (name: string, title: string) =>
  defineField({name, title, type: 'string', validation: (Rule) => Rule.max(180)})

const sectionBaseFields = [
  defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
  defineField({name: 'badge', title: 'Badge', type: 'string'}),
  defineField({name: 'title', title: 'Title', type: 'string'}),
  defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
]

export const statsItem = defineType({
  name: 'statsItem',
  title: 'Statistic',
  type: 'object',
  fields: [
    defineField({name: 'prependValue', title: 'Prefix', type: 'string'}),
    defineField({name: 'value', title: 'Value', type: 'string'}),
    defineField({name: 'appendValue', title: 'Suffix', type: 'string'}),
    defineField({name: 'label', title: 'Label', type: 'string'}),
  ],
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'title', title: 'Question', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'content', title: 'Answer', type: 'text', rows: 4, validation: (Rule) => Rule.required()}),
  ],
})

export const videoConfig = defineType({
  name: 'videoConfig',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({name: 'src', title: 'Video ID or URL', type: 'string'}),
    defineField({name: 'type', title: 'HTML5 type', type: 'string'}),
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
      },
      initialValue: 'youtube',
    }),
    imagePathField('poster', 'Poster path'),
    defineField({name: 'autoplay', title: 'Autoplay', type: 'boolean', initialValue: true}),
    defineField({name: 'id', title: 'Modal ID', type: 'string'}),
  ],
})

export const aboutContentSection = defineType({
  name: 'aboutContentSection',
  title: 'About content section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'list',
      title: 'Content blocks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({name: 'badge', title: 'Badge', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({
              name: 'services',
              title: 'Services or metrics',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'title', title: 'Title', type: 'string'}),
                    defineField({name: 'percent', title: 'Percent', type: 'string'}),
                  ],
                }),
              ],
            }),
            imagePathField('image', 'Image path'),
            altField('imageAlt', 'Image alt'),
            imagePathField('imageSecondary', 'Secondary image path'),
            altField('imageSecondaryAlt', 'Secondary image alt'),
            defineField({name: 'imageVerticalTitle', title: 'Image vertical title', type: 'string'}),
            defineField({name: 'leftImagePostion', title: 'Show image before text', type: 'boolean'}),
            buttonField,
            imagePathField('deocrativeScribble', 'Decorative scribble path'),
            altField('deocrativeScribbleAlt', 'Decorative scribble alt'),
            defineField({
              name: 'testimonial',
              title: 'Inline testimonial',
              type: 'object',
              fields: [
                defineField({name: 'name', title: 'Name', type: 'string'}),
                defineField({name: 'designation', title: 'Designation', type: 'string'}),
                imagePathField('image', 'Image path'),
                defineField({name: 'review', title: 'Review', type: 'text', rows: 3}),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

export const aboutHeroSection = defineType({
  name: 'aboutHeroSection',
  title: 'About hero section',
  type: 'object',
  fields: [
    ...sectionBaseFields,
    defineField({name: 'subTitle', title: 'Subtitle', type: 'string'}),
    imagePathField('arrowShapeImage', 'Arrow shape path'),
    altField('arrowShapeImageAlt', 'Arrow shape alt'),
    imagePathField('scribbleImage', 'Scribble path'),
    altField('scribbleImageAlt', 'Scribble alt'),
    imagePathField('image', 'Image path'),
    altField('imageAlt', 'Image alt'),
  ],
})

export const statsSection = defineType({
  name: 'statsSection',
  title: 'Stats section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    imagePathField('backgroundImage', 'Background image path'),
    altField('backgroundImageAlt', 'Background image alt'),
    defineField({name: 'list', title: 'Statistics', type: 'array', of: [defineArrayMember({type: 'statsItem'})]}),
  ],
})

export const statsMarqueeSection = defineType({
  name: 'statsMarqueeSection',
  title: 'Stats marquee section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    imagePathField('backgroundImage', 'Background image path'),
    altField('backgroundImageAlt', 'Background image alt'),
    imagePathField('shapeImage', 'Shape image path'),
    altField('shapeImageAlt', 'Shape image alt'),
    defineField({
      name: 'marquee',
      title: 'Marquee',
      type: 'object',
      fields: [
        defineField({name: 'elementWidth', title: 'Element width', type: 'string'}),
        defineField({name: 'elementWidthAuto', title: 'Element width auto', type: 'boolean', initialValue: true}),
        defineField({name: 'elementWidthInSmallDevices', title: 'Small-device width', type: 'string'}),
        defineField({name: 'pauseOnHover', title: 'Pause on hover', type: 'boolean'}),
        defineField({name: 'reverse', title: 'Reverse', type: 'string'}),
        defineField({name: 'duration', title: 'Duration', type: 'string'}),
        defineField({name: 'text', title: 'Text', type: 'string'}),
      ],
    }),
  ],
})

export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'limit', title: 'Limit', type: 'number'}),
  ],
})

export const featuresGridSection = defineType({
  name: 'featuresGridSection',
  title: 'Features grid section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'cardLayout',
      title: 'Card layout',
      type: 'string',
      options: {
        list: [
          {title: 'Outside icon', value: 'outsideIcon'},
          {title: 'Inside icon', value: 'insideIcon'},
          {title: 'Outside icon square', value: 'outsideIconSquare'},
        ],
      },
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            imagePathField('icon', 'Icon path'),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            imagePathField('backgroundImage', 'Background image path'),
            altField('backgroundImageAlt', 'Background image alt'),
          ],
        }),
      ],
    }),
  ],
})

export const testimonialSection = defineType({
  name: 'testimonialSection',
  title: 'Testimonial section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    imagePathField('decorativeImage', 'Decorative image path'),
    altField('decorativeImageAlt', 'Decorative image alt'),
    defineField({name: 'cardLayout', title: 'Card layout', type: 'string'}),
  ],
})

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'searchPlaceholder', title: 'Search placeholder', type: 'string'}),
    buttonField,
    defineField({
      name: 'imageList',
      title: 'Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [imagePathField('url', 'Image path'), altField('alt', 'Alt')],
        }),
      ],
    }),
    defineField({
      name: 'decorativeShapes',
      title: 'Decorative shapes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [imagePathField('url', 'Image path'), altField('alt', 'Alt')],
        }),
      ],
    }),
    defineField({name: 'list', title: 'Questions', type: 'array', of: [defineArrayMember({type: 'faqItem'})]}),
  ],
})

export const contactInputField = defineType({
  name: 'contactInputField',
  title: 'Contact form input',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'placeholder', title: 'Placeholder', type: 'string'}),
    defineField({name: 'name', title: 'Submission name', type: 'string'}),
    defineField({name: 'required', title: 'Required', type: 'boolean'}),
    defineField({name: 'halfWidth', title: 'Half width', type: 'boolean'}),
    defineField({name: 'defaultValue', title: 'Default value', type: 'string'}),
    defineField({name: 'selected', title: 'Selected', type: 'boolean'}),
    defineField({name: 'value', title: 'Value', type: 'string'}),
    defineField({name: 'checked', title: 'Checked', type: 'boolean'}),
    defineField({name: 'type', title: 'Input type', type: 'string'}),
    defineField({name: 'id', title: 'ID', type: 'string'}),
    defineField({name: 'tag', title: 'Tag', type: 'string'}),
    defineField({name: 'rows', title: 'Rows', type: 'string'}),
    defineField({name: 'group', title: 'Group', type: 'string'}),
    defineField({name: 'groupLabel', title: 'Group label', type: 'string'}),
    defineField({name: 'note', title: 'Note type', type: 'string'}),
    defineField({name: 'parentClass', title: 'Parent class', type: 'string'}),
    defineField({name: 'content', title: 'Content', type: 'text', rows: 2}),
    defineField({
      name: 'dropdown',
      title: 'Dropdown',
      type: 'object',
      fields: [
        defineField({name: 'type', title: 'Dropdown type', type: 'string'}),
        defineField({
          name: 'search',
          title: 'Search',
          type: 'object',
          fields: [defineField({name: 'placeholder', title: 'Placeholder', type: 'string'})],
        }),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'value', title: 'Value', type: 'string'}),
                defineField({name: 'selected', title: 'Selected', type: 'boolean'}),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

export const contactForm = defineType({
  name: 'contactForm',
  title: 'Contact form',
  type: 'object',
  fields: [
    defineField({name: 'action', title: 'Action override', type: 'string'}),
    defineField({name: 'emailSubject', title: 'Email subject', type: 'string'}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 2}),
    defineField({name: 'submitButton', title: 'Submit button', type: 'reusableButton'}),
    defineField({name: 'inputs', title: 'Inputs', type: 'array', of: [defineArrayMember({type: 'contactInputField'})]}),
  ],
})

export const contactSection = defineType({
  name: 'contactSection',
  title: 'Contact section',
  type: 'object',
  fields: [
    ...sectionBaseFields,
    imagePathField('backgroundImage', 'Background image path'),
    altField('backgroundImageAlt', 'Background image alt'),
    imagePathField('decorativeImage', 'Decorative image path'),
    altField('decorativeImageAlt', 'Decorative image alt'),
    defineField({name: 'faqList', title: 'FAQ list', type: 'array', of: [defineArrayMember({type: 'faqItem'})]}),
    defineField({name: 'contactBadge', title: 'Contact badge', type: 'string'}),
    defineField({name: 'contactTitle', title: 'Contact title', type: 'string'}),
    defineField({
      name: 'list',
      title: 'Contact methods',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            imagePathField('icon', 'Icon path'),
            defineField({name: 'settingFieldName', title: 'Global contact field', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'form', title: 'Form', type: 'contactForm'}),
  ],
})

export const ctaVideoSection = defineType({
  name: 'ctaVideoSection',
  title: 'CTA video section',
  type: 'object',
  fields: [
    ...sectionBaseFields,
    imagePathField('backgroundImage', 'Background image path'),
    altField('backgroundImageAlt', 'Background image alt'),
    imagePathField('scribbleArrow', 'Scribble arrow path'),
    altField('scribbleArrowAlt', 'Scribble arrow alt'),
    buttonField,
    defineField({name: 'video', title: 'Video', type: 'videoConfig'}),
  ],
})

export const ctaGallerySection = defineType({
  name: 'ctaGallerySection',
  title: 'CTA gallery section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    buttonField,
    defineField({
      name: 'list',
      title: 'Gallery items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            imagePathField('image', 'Image path'),
            defineField({name: 'url', title: 'URL', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string'}),
          ],
        }),
      ],
    }),
  ],
})

export const ctaBarSection = defineType({
  name: 'ctaBarSection',
  title: 'CTA bar section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'subTitle', title: 'Subtitle', type: 'string'}),
    buttonField,
    imagePathField('backgroundImage', 'Background image path'),
    altField('backgroundImageAlt', 'Background image alt'),
  ],
})

export const heroSectionTwo = defineType({
  name: 'heroSectionTwo',
  title: 'Hero section two',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'subTitle', title: 'Subtitle', type: 'string'}),
    defineField({name: 'titleLine1', title: 'Title line 1', type: 'string'}),
    defineField({name: 'titleLine2', title: 'Title line 2', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'sinceText', title: 'Since text', type: 'string'}),
    buttonField,
    defineField({name: 'buttonContact', title: 'Contact button', type: 'reusableButton'}),
    imagePathField('decorativeImage', 'Decorative image path'),
    altField('decorativeImageAlt', 'Decorative image alt'),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [imagePathField('image', 'Image path'), altField('alt', 'Alt')],
        }),
      ],
    }),
    defineField({name: 'video', title: 'Video', type: 'videoConfig'}),
  ],
})

export const socialBarSection = defineType({
  name: 'socialBarSection',
  title: 'Social bar section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    imagePathField('backgroundImage', 'Background image path'),
    altField('backgroundImageAlt', 'Background image alt'),
  ],
})

export const brandLogosSection = defineType({
  name: 'brandLogosSection',
  title: 'Brand logos section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({
      name: 'list',
      title: 'Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [imagePathField('src', 'Image path'), altField('alt', 'Alt')],
        }),
      ],
    }),
  ],
})

export const pricingSection = defineType({
  name: 'pricingSection',
  title: 'Pricing section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    imagePathField('decorativeImage', 'Decorative image path'),
    altField('decorativeImageAlt', 'Decorative image alt'),
    defineField({
      name: 'list',
      title: 'Plans',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
            defineField({name: 'name', title: 'Name', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'object',
              fields: [
                defineField({name: 'prependValue', title: 'Prefix', type: 'string'}),
                defineField({name: 'value', title: 'Value', type: 'string'}),
                defineField({name: 'appendValue', title: 'Suffix', type: 'string'}),
              ],
            }),
            defineField({name: 'features', title: 'Features', type: 'array', of: [defineArrayMember({type: 'string'})]}),
            buttonField,
          ],
        }),
      ],
    }),
  ],
})

export const caseStudiesSection = defineType({
  name: 'caseStudiesSection',
  title: 'Case studies section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    imagePathField('scribbleShapeImage', 'Scribble shape path'),
    altField('scribbleShapeImageAlt', 'Scribble shape alt'),
    buttonField,
    defineField({name: 'cardLayout', title: 'Card layout', type: 'string'}),
    defineField({name: 'limit', title: 'Limit', type: 'number'}),
  ],
})

export const blogSection = defineType({
  name: 'blogSection',
  title: 'Blog section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', initialValue: true}),
    defineField({name: 'badge', title: 'Badge', type: 'string'}),
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'object',
      fields: [
        defineField({name: 'layout', title: 'Layout', type: 'string'}),
        defineField({name: 'limit', title: 'Limit', type: 'number'}),
      ],
    }),
  ],
})
