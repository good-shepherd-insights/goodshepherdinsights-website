import config from ".astro/config.generated.json";
import { defineCollection } from "astro:content";
import { button, sectionsSchema } from "./sections.schema";
import { z } from "astro/zod";
import { CASESTUDIES_CARD_LAYOUT } from "@/enum";

const caseStudiesFolder = config.settings.caseStudiesFolder as "case-studies";

const emptyContentLoader = () => [];

// ------------------------
// Base Page Schema
// ------------------------
const basePage = z.object({
  pageType: z.string().optional(),
  badge: z.string().optional(),
  badgeSecondary: z.string().optional(),
  title: z.string(),
  titleSecondary: z.string().optional(),
  author: z.string().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  date: z.date().optional(),
  datePublished: z.string().optional(),
  dateModified: z.string().optional(),
  comments: z.number().optional(),
  description: z.string().optional(),
  weight: z.number().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
  button: button.optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  imageAlt: z.string().optional(),
  robots: z.string().optional(),
  excludeFromSitemap: z.boolean().optional(),
  excludeFromCollection: z.boolean().optional(),
  customSlug: z.string().optional(),
  canonical: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  disableTagline: z.boolean().optional(),
  faqItems: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .optional(),
  serviceType: z.string().optional(),
});

export const page = basePage.extend(sectionsSchema);

// ------------------------
// Marquee Schema
// ------------------------
export const marqueeConfig = z.object({
  elementWidth: z.string(),
  elementWidthAuto: z.boolean(),
  elementWidthInSmallDevices: z.string(),
  pauseOnHover: z.boolean(),
  reverse: z.enum(["reverse", ""]).optional(),
  duration: z.string(),
});

// ------------------------
// Collections
// ------------------------

// Pages
const pagesCollection = defineCollection({
  loader: emptyContentLoader,
  schema: page,
});

// CaseStudies
const caseStudyCollection = defineCollection({
  loader: emptyContentLoader,
  schema: page.extend({
    images: z.array(z.string()).min(1).optional(),
    options: z
      .object({
        layout: z.enum(CASESTUDIES_CARD_LAYOUT),
        appearance: z.enum(["dark", "light"]).optional(),
        limit: z.union([z.number().int(), z.literal(false)]).optional(),
      })
      .optional(),
    information: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      )
      .optional(),
  }),
});

// Team
const teamItem = z.object({
  enable: z.boolean().default(true).optional(),
  title: z.string(),
  image: z.string(),
  profession: z.string().optional(),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  social: z
    .array(
      z.object({
        enable: z.boolean(),
        label: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
});
export const teamCollection = defineCollection({
  loader: emptyContentLoader,
  schema: page.extend({
    list: z.array(teamItem).optional(),
  }),
});

const testimonialItem = z.object({
  enable: z.boolean().default(true).optional(),
  content: z.string(),
  platform: z
    .object({
      name: z.string(),
      icon: z.string(),
    })
    .optional(),
  customer: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string().optional(),
    company: z.string().optional(),
    companyLogo: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
  }),
});
export const testimonialCollection = defineCollection({
  loader: emptyContentLoader,
  schema: page.extend({
    list: z.array(testimonialItem).optional(),
    listHome2: z.array(testimonialItem).optional(),
  }),
});

// ------------------------
// Export Collections
// ------------------------
export const collections = {
  [caseStudiesFolder]: caseStudyCollection,

  pages: pagesCollection,
  team: teamCollection,

  sections: defineCollection({
    loader: emptyContentLoader,
  }),

  homepage: defineCollection({
    loader: emptyContentLoader,
  }),

  "about-us": defineCollection({
    loader: emptyContentLoader,
  }),

  contact: defineCollection({
    loader: emptyContentLoader,
  }),

  faq: defineCollection({
    loader: emptyContentLoader,
  }),

  pricing: defineCollection({
    loader: emptyContentLoader,
  }),

  author: defineCollection({
    loader: emptyContentLoader,
  }),

  testimonial: testimonialCollection,
};
