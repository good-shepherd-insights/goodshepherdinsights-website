import {defineArrayMember, defineField, defineType} from 'sanity'
import {buttonHoverEffectOptions, buttonVariantOptions} from './shared'

export const globalButton = defineType({
  name: 'globalButton',
  title: 'Global Button',
  type: 'object',
  fields: [
    defineField({
      name: 'enable',
      title: 'Enable',
      type: 'boolean',
      description: 'Uncheck to hide this button without deleting its content.',
      initialValue: true,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Button text shown to visitors. Max 100 characters.',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Where the button links to. Absolute URL or a site-relative path like /contact.',
      validation: (Rule) => Rule.required().max(2048),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      description: 'Visual style of the button.',
      options: {list: buttonVariantOptions},
    }),
    defineField({
      name: 'hoverEffect',
      title: 'Hover effect',
      type: 'string',
      description: 'Animation applied when a visitor hovers the button.',
      options: {list: buttonHoverEffectOptions},
    }),
    defineField({name: 'rel', title: 'Rel', type: 'string', description: 'HTML rel attribute, e.g. "noopener" or "nofollow".'}),
    defineField({
      name: 'target',
      title: 'Target',
      type: 'string',
      description: 'Whether the link opens in the same tab or a new one.',
      options: {
        list: [
          {title: 'Same tab', value: '_self'},
          {title: 'New tab', value: '_blank'},
        ],
      },
    }),
  ],
})

export const brand = defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      description: 'Site name shown in the header logo area and used as the default page-title suffix.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'logoPath',
      title: 'Logo path',
      type: 'string',
      description: 'Path to the primary logo file, e.g. /images/logo.svg.',
      validation: (Rule) => Rule.required().max(2048),
    }),
    defineField({
      name: 'logoAlternatePath',
      title: 'Alternate logo path',
      type: 'string',
      description: 'Optional alternate logo (e.g. for a dark header or footer background).',
      validation: (Rule) => Rule.max(2048),
    }),
    defineField({name: 'logoText', title: 'Logo text', type: 'string', description: 'Text shown next to or instead of the logo image, if the theme supports it.'}),
    defineField({name: 'logoWidth', title: 'Logo width', type: 'string', description: 'Rendered logo width, e.g. "160" or "160px".'}),
    defineField({name: 'logoHeight', title: 'Logo height', type: 'string', description: 'Rendered logo height, e.g. "40" or "40px".'}),
  ],
  preview: {
    prepare() {
      return {title: 'Brand'}
    },
  },
})

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'addressText',
      title: 'Address',
      type: 'string',
      description: 'Postal address as displayed to visitors (footer, contact page).',
      validation: (Rule) => Rule.required().max(240),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Phone label',
      type: 'string',
      description: 'Phone number as displayed to visitors, e.g. "+1 (555) 123-4567".',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'phoneHref',
      title: 'Phone link',
      type: 'string',
      description: 'tel: link target for the phone number, e.g. "tel:+15551234567".',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email label',
      type: 'string',
      description: 'Email address as displayed to visitors.',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'emailHref',
      title: 'Email link',
      type: 'string',
      description: 'mailto: link target for the email address, e.g. "mailto:hello@example.com".',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({name: 'mapEmbedUrl', title: 'Map embed URL', type: 'url', description: 'Embeddable map URL (e.g. Google Maps embed link) shown on the contact page.'}),
  ],
  preview: {
    prepare() {
      return {title: 'Contact'}
    },
  },
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'enable',
      title: 'Enable',
      type: 'boolean',
      description: 'Uncheck to hide this social link without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Platform name shown as the link\'s accessible label, e.g. "Instagram".',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Full profile URL for this platform.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})

export const socialLinks = defineType({
  name: 'socialLinks',
  title: 'Social Links',
  type: 'document',
  fields: [
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      description: 'Social profile links shown in the header and/or footer.',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Social Links'}
    },
  },
})

export const navigationChildItem = defineType({
  name: 'navigationChildItem',
  title: 'Navigation Child Item',
  type: 'object',
  fields: [
    defineField({
      name: 'enable',
      title: 'Enable',
      type: 'boolean',
      description: 'Uncheck to hide this link without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'name',
      title: 'Label',
      type: 'string',
      description: 'Link text shown to visitors.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      description: 'Where this link points to. Absolute URL or a site-relative path.',
      validation: (Rule) => Rule.required().max(2048),
    }),
    defineField({name: 'weight', title: 'Weight', type: 'number', description: 'Sort order among sibling links; lower numbers appear first.'}),
    defineField({name: 'rel', title: 'Rel', type: 'string', description: 'HTML rel attribute, e.g. "noopener" or "nofollow".'}),
    defineField({name: 'target', title: 'Target', type: 'string', description: 'HTML target attribute, e.g. "_blank" to open in a new tab.'}),
  ],
})

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'enable',
      title: 'Enable',
      type: 'boolean',
      description: 'Uncheck to hide this link (and its children) without deleting it.',
      initialValue: true,
    }),
    defineField({
      name: 'name',
      title: 'Label',
      type: 'string',
      description: 'Link text shown to visitors.',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({name: 'url', title: 'URL', type: 'string', description: 'Where this link points to. Leave blank if this item only opens a dropdown of children.', validation: (Rule) => Rule.max(2048)}),
    defineField({name: 'weight', title: 'Weight', type: 'number', description: 'Sort order among sibling top-level links; lower numbers appear first.'}),
    defineField({name: 'rel', title: 'Rel', type: 'string', description: 'HTML rel attribute, e.g. "noopener" or "nofollow".'}),
    defineField({name: 'target', title: 'Target', type: 'string', description: 'HTML target attribute, e.g. "_blank" to open in a new tab.'}),
    defineField({
      name: 'children',
      title: 'Children',
      type: 'array',
      description: 'Dropdown links shown under this item in the primary navigation.',
      of: [defineArrayMember({type: 'navigationChildItem'})],
    }),
  ],
})

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  fields: [
    defineField({
      name: 'primaryNavigation',
      title: 'Primary navigation',
      type: 'array',
      description: 'Main site navigation menu, ordered by each item\'s Weight.',
      of: [defineArrayMember({type: 'navigationItem'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'navigationButton', title: 'Navigation button', type: 'globalButton', description: 'Call-to-action button shown at the end of the header navigation.'}),
    defineField({
      name: 'topBar',
      title: 'Top bar',
      type: 'object',
      description: 'Thin bar above the main header showing working hours and quick contact links.',
      fields: [
        defineField({name: 'workingHoursLabel', title: 'Working hours label', type: 'string', description: 'e.g. "Mon - Fri:".'}),
        defineField({name: 'workingHoursValue', title: 'Working hours value', type: 'string', description: 'e.g. "9:00 - 18:00".'}),
        defineField({name: 'callLabel', title: 'Call label', type: 'string', description: 'Label shown before the phone number, e.g. "Call us".'}),
        defineField({name: 'hotLineLabel', title: 'Hotline label', type: 'string', description: 'Label for a secondary/emergency contact number.'}),
        defineField({name: 'letsChatLabel', title: 'Lets chat label', type: 'string', description: 'Label for a chat/contact CTA in the top bar.'}),
      ],
    }),
    defineField({
      name: 'announcementBar',
      title: 'Announcement bar',
      type: 'object',
      description: 'Optional dismissible banner shown above the header.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the announcement bar site-wide.', initialValue: true}),
        defineField({name: 'label', title: 'Label', type: 'text', rows: 2, description: 'Announcement text.'}),
      ],
    }),
    defineField({
      name: 'offcanvas',
      title: 'Offcanvas',
      type: 'object',
      description: 'Content shown in the slide-out mobile navigation panel.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Include this content in the offcanvas panel.', initialValue: true}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Short blurb shown in the offcanvas panel.'}),
        defineField({name: 'button', title: 'Button', type: 'globalButton', description: 'Call-to-action button shown in the offcanvas panel.'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Header'}
    },
  },
})

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'primary',
      title: 'Primary footer',
      type: 'object',
      description: 'Main footer row: company blurb, headings, and navigation columns.',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Short company blurb shown in the footer.'}),
        defineField({name: 'supportLabel', title: 'Support label', type: 'string', description: 'Heading above support/contact details in the footer.'}),
        defineField({name: 'servicesHeading', title: 'Services heading', type: 'string', description: 'Heading above the services link list in the footer.'}),
        defineField({name: 'contactHeading', title: 'Contact heading', type: 'string', description: 'Heading above the contact details in the footer.'}),
        defineField({name: 'workHourLabel', title: 'Work hour label', type: 'string', description: 'Label shown before working hours, e.g. "Working hours".'}),
        defineField({name: 'workHourValue', title: 'Work hour value', type: 'string', description: 'e.g. "Mon - Fri, 9:00 - 18:00".'}),
        defineField({name: 'sinceText', title: 'Since text', type: 'string', description: 'e.g. "Since 2015" shown in the footer.'}),
        defineField({
          name: 'navigation',
          title: 'Navigation',
          type: 'array',
          description: 'Footer link column, ordered by each item\'s Weight.',
          of: [defineArrayMember({type: 'navigationChildItem'})],
        }),
      ],
    }),
    defineField({
      name: 'secondary',
      title: 'Secondary footer',
      type: 'object',
      description: 'Second footer row: newsletter signup and an additional navigation column.',
      fields: [
        defineField({name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Short blurb shown above the secondary footer navigation.'}),
        defineField({name: 'callUsLabel', title: 'Call us label', type: 'string', description: 'Label shown before the phone number in the secondary footer.'}),
        defineField({
          name: 'subscription',
          title: 'Subscription',
          type: 'object',
          description: 'Newsletter signup form shown in the secondary footer.',
          fields: [
            defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the newsletter signup form.', initialValue: true}),
            defineField({name: 'title', title: 'Title', type: 'string', description: 'Heading above the signup form.'}),
            defineField({name: 'note', title: 'Note', type: 'text', rows: 2, description: 'Small print shown under the signup form.'}),
            defineField({name: 'formAction', title: 'Form action', type: 'string', description: 'URL the signup form submits to.'}),
            defineField({name: 'mailchimpTagValue', title: 'Mailchimp tag value', type: 'string', description: 'Mailchimp tag applied to subscribers who sign up here.'}),
            defineField({name: 'emailPlaceholder', title: 'Email placeholder', type: 'string', description: 'Placeholder text shown in the empty email field.'}),
            defineField({name: 'submitLabel', title: 'Submit label', type: 'string', description: 'Text shown on the submit button.'}),
          ],
        }),
        defineField({
          name: 'navigation',
          title: 'Navigation',
          type: 'array',
          description: 'Second footer link column, ordered by each item\'s Weight.',
          of: [defineArrayMember({type: 'navigationChildItem'})],
        }),
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'object',
      description: 'Copyright line shown at the very bottom of the footer.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Show the copyright line.', initialValue: true}),
        defineField({name: 'text', title: 'Text', type: 'text', rows: 2, description: 'Copyright text, e.g. "© 2026 Good Shepherd Insights. All rights reserved."'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Footer'}
    },
  },
})

export const globalFaviconItem = defineType({
  name: 'globalFaviconItem',
  title: 'Favicon Entry',
  type: 'object',
  fields: [
    defineField({name: 'rel', title: 'Rel', type: 'string', description: 'Value of the <link rel="..."> attribute, e.g. "icon" or "apple-touch-icon".', validation: (Rule) => Rule.required()}),
    defineField({name: 'type', title: 'MIME type', type: 'string', description: 'e.g. "image/png" or "image/svg+xml".'}),
    defineField({name: 'sizes', title: 'Sizes', type: 'string', description: 'e.g. "32x32" or "180x180".'}),
    defineField({name: 'purpose', title: 'Purpose', type: 'string', description: 'e.g. "maskable" for adaptive app icons.'}),
    defineField({name: 'color', title: 'Color (Safari pinned)', type: 'string', description: 'Mask icon color for Safari pinned tabs, e.g. "#0f172a". Only used when rel is "mask-icon".'}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt', description: 'The favicon/icon image file for this entry.', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {
      rel: 'rel',
      sizes: 'sizes',
      alt: 'image.alt',
      media: 'image.image',
    },
    prepare({rel, sizes, alt, media}) {
      return {
        title: `${rel || 'icon'}${sizes ? ` (${sizes})` : ''}`,
        subtitle: alt,
        media,
      }
    },
  },
})

export const seoDefaults = defineType({
  name: 'seoDefaults',
  title: 'SEO Defaults',
  type: 'document',
  fields: [
    defineField({name: 'author', title: 'Author', type: 'string', description: 'Default content author, used where a page or post does not set its own.'}),
    defineField({name: 'title', title: 'Fallback title', type: 'string', description: 'Used as the page <title> when a page does not set its own SEO title.'}),
    defineField({name: 'description', title: 'Fallback description', type: 'text', rows: 3, description: 'Used as the meta description when a page does not set its own.'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string', description: 'Site tagline appended to page titles, e.g. "Good Shepherd Insights - Church Consulting".'}),
    defineField({name: 'taglineSeparator', title: 'Tagline separator', type: 'string', description: 'Characters placed between a page title and the tagline, e.g. " | " or " - ".'}),
    defineField({name: 'baseUrl', title: 'Base URL', type: 'url', description: 'Canonical site origin used to build absolute URLs, e.g. https://www.example.com.'}),
    defineField({name: 'defaultImage', title: 'Default social image path', type: 'string', description: 'Fallback Open Graph/Twitter image when a page does not set its own.'}),
    defineField({name: 'pageHeaderDefaultImage', title: 'Default page header image path', type: 'string', description: 'Fallback header/banner image for pages that do not set their own.'}),
    defineField({
      name: 'faviconSet',
      title: 'Favicon set',
      type: 'array',
      of: [defineArrayMember({type: 'globalFaviconItem'})],
      description: 'Browser/app favicons. Each entry renders a <link rel="..."> tag.',
    }),
    defineField({name: 'keywords', title: 'Default keywords', type: 'array', of: [defineArrayMember({type: 'string'})], description: 'Fallback meta keywords when a page does not set its own.'}),
    defineField({name: 'robots', title: 'Default robots directive', type: 'string', description: 'Fallback robots meta value, e.g. "index, follow", when a page does not set its own.'}),
    defineField({name: 'ogLocale', title: 'Open Graph locale', type: 'string', description: 'og:locale value, e.g. "en_US".'}),
    defineField({name: 'ogType', title: 'Open Graph type', type: 'string', description: 'og:type value, e.g. "website".'}),
    defineField({name: 'twitter', title: 'Twitter handle', type: 'string', description: 'Site\'s Twitter/X handle, used for twitter:site, e.g. "@example".'}),
    defineField({name: 'twitterCard', title: 'Twitter card', type: 'string', description: 'twitter:card value, e.g. "summary_large_image".'}),
    defineField({name: 'themeColorLight', title: 'Theme color light', type: 'string', description: 'theme-color meta value used in light mode, e.g. "#ffffff".'}),
    defineField({name: 'themeColorDark', title: 'Theme color dark', type: 'string', description: 'theme-color meta value used in dark mode, e.g. "#0f172a".'}),
    defineField({name: 'headContent', title: 'Custom head content', type: 'text', rows: 6, description: 'Raw HTML injected into <head> on every page. Use with care - not sanitized.'}),
  ],
  preview: {
    prepare() {
      return {title: 'SEO Defaults'}
    },
  },
})

export const organization = defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', description: 'Legal/organization name used in Organization JSON-LD structured data.'}),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      description: 'Postal address used in Organization JSON-LD structured data (schema.org PostalAddress).',
      fields: [
        defineField({name: 'streetAddress', title: 'Street address', type: 'string', description: 'schema.org PostalAddress.streetAddress.'}),
        defineField({name: 'addressLocality', title: 'Address locality', type: 'string', description: 'City/locality used in Organization JSON-LD structured data.'}),
        defineField({name: 'addressRegion', title: 'Address region', type: 'string', description: 'State/region used in Organization JSON-LD structured data.'}),
      ],
    }),
    defineField({name: 'email', title: 'Email', type: 'string', description: 'Organization contact email used in JSON-LD structured data.'}),
    defineField({name: 'telephone', title: 'Telephone', type: 'string', description: 'Organization phone number used in JSON-LD structured data.'}),
    defineField({name: 'logo', title: 'Logo path', type: 'string', description: 'Logo image path used in Organization JSON-LD structured data.'}),
  ],
  preview: {
    prepare() {
      return {title: 'Organization'}
    },
  },
})

export const indexing = defineType({
  name: 'indexing',
  title: 'Indexing',
  type: 'document',
  fields: [
    defineField({
      name: 'robotsTxt',
      title: 'Robots.txt',
      type: 'object',
      description: 'Controls the generated /robots.txt file.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Generate a robots.txt file for this site.', initialValue: true}),
        defineField({name: 'disallow', title: 'Disallow paths', type: 'array', of: [defineArrayMember({type: 'string'})], description: 'Path prefixes to disallow, e.g. "/admin/".'}),
      ],
    }),
    defineField({
      name: 'sitemap',
      title: 'Sitemap',
      type: 'object',
      description: 'Controls the generated XML sitemap.',
      fields: [
        defineField({name: 'enable', title: 'Enable', type: 'boolean', description: 'Generate an XML sitemap for this site.', initialValue: true}),
        defineField({name: 'exclude', title: 'Excluded path fragments', type: 'array', of: [defineArrayMember({type: 'string'})], description: 'URLs containing any of these fragments are left out of the sitemap.'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Indexing'}
    },
  },
})

export const forms = defineType({
  name: 'forms',
  title: 'Forms',
  type: 'document',
  fields: [
    defineField({name: 'contactFormProvider', title: 'Contact form provider', type: 'string', description: 'Which backend handles contact form submissions, e.g. "formspree" or "mailchimp".'}),
    defineField({name: 'contactFormAction', title: 'Contact form action', type: 'string', description: 'URL the contact form submits to.'}),
    defineField({name: 'subscriptionFormAction', title: 'Subscription form action', type: 'string', description: 'URL the newsletter subscription form submits to.'}),
    defineField({name: 'mailchimpTagValue', title: 'Mailchimp tag value', type: 'string', description: 'Default Mailchimp tag applied to subscribers site-wide.'}),
    defineField({
      name: 'messages',
      title: 'Form messages',
      type: 'object',
      description: 'Fallback status messages shown by forms across the site.',
      fields: [
        defineField({name: 'missingAction', title: 'Missing action message', type: 'string', description: 'Shown when a form has no submission URL configured.'}),
        defineField({name: 'subscribeSuccess', title: 'Subscribe success fallback', type: 'string', description: 'Shown after a successful newsletter signup.'}),
        defineField({name: 'subscribeError', title: 'Subscribe error fallback', type: 'string', description: 'Shown when the newsletter provider rejects a signup.'}),
        defineField({name: 'subscribeNetworkError', title: 'Subscribe network error fallback', type: 'string', description: 'Shown when the newsletter signup request fails to reach the server.'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Forms'}
    },
  },
})

export const appManifest = defineType({
  name: 'appManifest',
  title: 'App Manifest',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', description: 'Full app name used in the web app manifest.'}),
    defineField({name: 'shortName', title: 'Short name', type: 'string', description: 'Short name shown under the home-screen icon when the site is installed as a PWA.'}),
    defineField({name: 'themeColor', title: 'Theme color', type: 'string', description: 'Manifest theme_color value, e.g. "#0f172a".'}),
    defineField({name: 'backgroundColor', title: 'Background color', type: 'string', description: 'Manifest background_color value shown on the splash screen.'}),
    defineField({name: 'display', title: 'Display', type: 'string', description: 'Manifest display mode, e.g. "standalone" or "browser".'}),
    defineField({
      name: 'icons',
      title: 'Icons',
      type: 'array',
      description: 'App icons listed in the web app manifest, at various sizes.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'sizes', title: 'Sizes', type: 'string', description: 'e.g. "192x192" or "512x512".'}),
            defineField({name: 'type', title: 'Type', type: 'string', description: 'e.g. "image/png".'}),
            defineField({name: 'purpose', title: 'Purpose', type: 'string', description: 'e.g. "any" or "maskable".'}),
            defineField({name: 'image', title: 'Image', type: 'imageWithAlt', description: 'The icon image file.', validation: (Rule) => Rule.required()}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'App Manifest'}
    },
  },
})

export const uiCopy = defineType({
  name: 'uiCopy',
  title: 'UI Copy',
  type: 'document',
  fields: [
    defineField({name: 'copy', title: 'Copy JSON', type: 'text', rows: 30, description: 'Raw JSON blob of miscellaneous UI strings consumed by the frontend. Must be valid JSON.'}),
  ],
  preview: {
    prepare() {
      return {title: 'UI Copy'}
    },
  },
})
