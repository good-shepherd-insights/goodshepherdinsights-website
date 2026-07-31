import {defineArrayMember, defineField, defineType} from 'sanity'

const serviceCardLayouts = [
  {title: 'Horizontal', value: 'horizontal'},
  {title: 'List with image', value: 'listImage'},
]

const blogCardLayouts = [
  {title: 'Grid', value: 'grid'},
  {title: 'Featured', value: 'featured'},
  {title: 'Horizontal', value: 'horizontal'},
  {title: 'Compact', value: 'compact'},
]

export const homeHeroSection = defineType({
  name: 'homeHeroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the hero section at the top of the homepage.', initialValue: true}),
    defineField({
      name: 'subTitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small kicker text shown above the two-line title. Max 120 characters.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'titleLine1',
      title: 'Title line 1',
      type: 'string',
      description: 'First line of the hero headline. Max 80 characters.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'titleLine2',
      title: 'Title line 2',
      type: 'string',
      description: 'Second line of the hero headline. Max 80 characters.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Supporting copy shown under the hero headline.'}),
    defineField({name: 'arrowDecorationImage', title: 'Arrow decoration', type: 'imageWithAlt', description: 'Decorative arrow graphic overlaid on the hero.'}),
    defineField({name: 'shapeImage', title: 'Shape image', type: 'imageWithAlt', description: 'Decorative background shape overlaid on the hero.'}),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      description: 'Hero image carousel. At least one slide is required.',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({name: 'image', title: 'Image', type: 'imageWithAlt'})],
          preview: {
            select: {title: 'image.alt', media: 'image.image'},
          },
        }),
      ],
    }),
    defineField({
      name: 'satisfactionClients',
      title: 'Satisfaction clients',
      type: 'object',
      description: 'Client-avatar social-proof widget shown in the hero.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the client-avatar widget.', initialValue: false}),
        defineField({
          name: 'avatars',
          title: 'Avatars',
          type: 'array',
          description: 'Client avatar images shown in a stacked row.',
          of: [defineArrayMember({type: 'imageWithAlt'})],
        }),
        defineField({name: 'avatarAlt', title: 'Shared avatar alt text', type: 'string', description: 'Fallback alt text applied to avatars that don\'t set their own.'}),
        defineField({name: 'count', title: 'Count', type: 'string', description: 'Number/label shown next to the avatars, e.g. "500+".'}),
        defineField({name: 'label', title: 'Label', type: 'string', description: 'Caption shown next to the avatars, e.g. "Happy clients".'}),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'object',
      description: 'Optional video modal triggered from the hero.',
      fields: [
        defineField({name: 'src', title: 'Video ID or URL', type: 'string', description: 'YouTube/Vimeo video ID, or a direct file URL for HTML5.'}),
        defineField({name: 'type', title: 'HTML5 video type', type: 'string', description: 'MIME type for an HTML5 video file, e.g. "video/mp4". Only used when Provider is HTML5.'}),
        defineField({
          name: 'provider',
          title: 'Provider',
          type: 'string',
          description: 'Which video service Src refers to.',
          options: {
            list: [
              {title: 'YouTube', value: 'youtube'},
              {title: 'Vimeo', value: 'vimeo'},
              {title: 'HTML5', value: 'html5'},
            ],
          },
          initialValue: 'youtube',
        }),
        defineField({name: 'poster', title: 'Poster image', type: 'imageWithAlt', description: 'Thumbnail shown before the video plays.'}),
        defineField({name: 'autoplay', title: 'Autoplay', type: 'boolean', description: 'Autoplay the video once the modal opens.', initialValue: true}),
        defineField({name: 'id', title: 'Modal ID', type: 'string', description: 'HTML id used to wire the play button to this video modal.'}),
      ],
    }),
    defineField({
      name: 'helpDropdown',
      title: 'Help dropdown',
      type: 'object',
      description: 'Optional quick-help menu shown in the hero.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the help dropdown.', initialValue: false}),
        defineField({name: 'label', title: 'Label', type: 'string', description: 'Text shown on the dropdown\'s toggle button.'}),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          description: 'Links listed in the dropdown.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'url', title: 'URL', type: 'string'}),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})

export const homeServicesSection = defineType({
  name: 'homeServicesSection',
  title: 'Services Section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the services section on the homepage.', initialValue: true}),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Small kicker label shown above the section title. Max 80 characters.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section heading. Max 160 characters.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Supporting copy shown under the section title.'}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt', description: 'Decorative image shown alongside the services list.'}),
    defineField({name: 'button', title: 'Button', type: 'reusableButton', description: 'Call-to-action button shown at the end of the section.'}),
    defineField({
      name: 'cardLayout',
      title: 'Card layout',
      type: 'string',
      description: 'Visual layout used for each service card.',
      options: {list: serviceCardLayouts},
      initialValue: 'horizontal',
    }),
    defineField({
      name: 'limit',
      title: 'Limit',
      type: 'number',
      description: 'Maximum number of services to show in this section.',
      validation: (Rule) => Rule.integer().min(1),
    }),
  ],
})

export const homeAboutSection = defineType({
  name: 'homeAboutSection',
  title: 'About Section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the about section on the homepage.', initialValue: true}),
    defineField({
      name: 'list',
      title: 'Content blocks',
      type: 'array',
      description: 'One or more alternating text/image blocks. At least one is required.',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show this block.', initialValue: true}),
            defineField({name: 'badge', title: 'Badge', type: 'string', description: 'Small kicker label shown above this block\'s title.'}),
            defineField({name: 'title', title: 'Title', type: 'string', description: 'Block heading.'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Block body copy.'}),
            defineField({
              name: 'services',
              title: 'Services or metrics',
              type: 'array',
              description: 'Small list of labeled stats or bullet points shown in this block.',
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
            defineField({name: 'image', title: 'Image', type: 'imageWithAlt', description: 'Image shown alongside this block\'s text.'}),
            defineField({
              name: 'imageVerticalTitle',
              title: 'Image vertical title',
              type: 'string',
              description: 'Text rotated and displayed alongside the image, if the layout supports it.',
            }),
            defineField({
              name: 'leftImagePosition',
              title: 'Show image before text',
              type: 'boolean',
              description: 'Place the image to the left of the text instead of the right.',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'badge', media: 'image.image'},
          },
        }),
      ],
    }),
  ],
})

export const homeBlogSection = defineType({
  name: 'homeBlogSection',
  title: 'Blog Section',
  type: 'object',
  fields: [
    defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the blog section on the homepage.', initialValue: true}),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Small kicker label shown above the section title. Max 80 characters.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section heading. Max 160 characters.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'options',
      title: 'Display options',
      type: 'object',
      description: 'Layout and count for the blog post previews shown in this section.',
      fields: [
        defineField({
          name: 'layout',
          title: 'Layout',
          type: 'string',
          description: 'Visual layout used for each post card.',
          options: {list: blogCardLayouts},
          initialValue: 'grid',
        }),
        defineField({
          name: 'limit',
          title: 'Limit',
          type: 'number',
          description: 'Maximum number of posts to show in this section.',
          validation: (Rule) => Rule.integer().min(1),
        }),
      ],
    }),
  ],
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  groups: [
    {name: 'page', title: 'Page', default: true},
    {name: 'sections', title: 'Sections'},
    {name: 'settings', title: 'Settings'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'page',
      description: 'Internal reference title shown in the Studio document list. Not rendered on the page.',
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: 'pageType',
      title: 'Page type',
      type: 'string',
      group: 'settings',
      description: 'Internal page-type identifier forwarded to the page layout.',
      initialValue: 'home',
    }),
    defineField({
      name: 'disableTagline',
      title: 'Disable tagline',
      type: 'boolean',
      group: 'settings',
      description: 'Hide the site tagline from the homepage\'s browser-tab title.',
      initialValue: true,
    }),
    defineField({name: 'image', title: 'Social image', type: 'imageWithAlt', group: 'seo', description: 'Fallback Open Graph/Twitter image for the homepage.'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields', group: 'seo', description: 'Overrides for the homepage\'s meta title, description, and indexing.'}),
    defineField({
      name: 'heroSection',
      title: 'Hero section',
      type: 'homeHeroSection',
      group: 'sections',
    }),
    defineField({
      name: 'servicesSection',
      title: 'Services section',
      type: 'homeServicesSection',
      group: 'sections',
    }),
    defineField({
      name: 'aboutSection',
      title: 'About section',
      type: 'homeAboutSection',
      group: 'sections',
    }),
    defineField({
      name: 'blogSection',
      title: 'Blog section',
      type: 'homeBlogSection',
      group: 'sections',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Homepage'}
    },
  },
})
