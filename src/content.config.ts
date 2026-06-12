import config from ".astro/config.generated.json";
import { defineCollection } from "astro:content";
import { button, sectionsSchema } from "./sections.schema";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
  BLOG_CARD_LAYOUT,
  CASESTUDIES_CARD_LAYOUT,
  SERVICE_CARD_LAYOUT,
} from "@/enum";

const caseStudiesFolder = config.settings.caseStudiesFolder as "case-studies";
const blogFolder = config.settings.blogFolder || "blog";
const serviceFolder = config.settings.serviceFolder || "services";
const testimonialFolder = config.settings.testimonialFolder || "testimonial";

const contentLoader = (base: string) =>
  glob({ pattern: "**/[^_]*.{md,mdx}", base });

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
  robots: z.string().optional(),
  excludeFromSitemap: z.boolean().optional(),
  excludeFromCollection: z.boolean().optional(),
  customSlug: z.string().optional(),
  canonical: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  disableTagline: z.boolean().optional(),
  faqItems: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
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
  loader: contentLoader("./src/content/pages"),
  schema: page,
});

// Services
const serviceCollection = defineCollection({
  loader: contentLoader(`./src/content/${serviceFolder}`),
  schema: page.extend({
    icon: z.string().optional(),
    image: z.string().optional(),
    imagePosition: z.string().optional(),
    image3: z.string().optional(),
    options: z
      .object({
        layout: z.enum(SERVICE_CARD_LAYOUT).optional(),
        limit: z.union([z.number().int(), z.literal(false)]).optional(),
      })
      .optional(),
  }),
});

// Blog
const blogCollection = defineCollection({
  loader: contentLoader(`./src/content/${blogFolder}`),
  schema: page.extend({
    searchSection: z
      .object({
        title: z.string(),
        searchPlaceholder: z.string(),
        button: button.optional(),
      })
      .optional(),
    options: z
      .object({
        search: z.boolean().optional(),
        layout: z.enum(BLOG_CARD_LAYOUT).optional(),
        appearance: z.enum(["dark", "light"]).optional(),
        columns: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
        limit: z.union([z.number().int(), z.literal(false)]).optional(),
      })
      .optional(),
    commentList: z
      .array(
        z.object({
          avatar: z.string().optional(),
          name: z.string(),
          date: z.string(),
          content: z.string(),
        }),
      )
      .optional(),
  }),
});

// CaseStudies
const caseStudyCollection = defineCollection({
  loader: contentLoader(`./src/content/${caseStudiesFolder}`),
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
  loader: contentLoader("./src/content/team"),
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
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: `./src/content/${testimonialFolder}`,
  }),
  schema: page.extend({
    list: z.array(testimonialItem).optional(),
    listHome2: z.array(testimonialItem).optional(),
  }),
});

// ------------------------
// Export Collections
// ------------------------
export const collections = {
  [blogFolder]: blogCollection,
  blog: blogCollection,

  [serviceFolder]: serviceCollection,
  services: serviceCollection,

  [caseStudiesFolder]: caseStudyCollection,

  pages: pagesCollection,
  team: teamCollection,

  sections: defineCollection({
    loader: contentLoader("./src/content/sections"),
  }),

  homepage: defineCollection({
    loader: contentLoader("./src/content/homepage"),
  }),

  "about-us": defineCollection({
    loader: contentLoader("./src/content/about-us"),
  }),

  contact: defineCollection({
    loader: contentLoader("./src/content/contact"),
  }),

  faq: defineCollection({
    loader: contentLoader("./src/content/faq"),
  }),

  pricing: defineCollection({
    loader: contentLoader("./src/content/pricing"),
  }),

  author: defineCollection({
    loader: contentLoader("./src/content/author"),
  }),

  testimonial: testimonialCollection,
};
