import { z } from "astro/zod";
import {
  BLOG_CARD_LAYOUT,
  FEATURED_GRID_CARD_LAYOUT,
  CASESTUDIES_CARD_LAYOUT,
  SERVICE_CARD_LAYOUT,
  TESTIMONIAL_CARD_LAYOUT,
} from "@/enum";

export const sharedButton = z.object({
  id: z.string().optional(),
  enable: z.boolean().optional(),
  tag: z.enum(["a", "button"]).optional(),
  url: z.string().optional(),
  buttonType: z
    .enum(["button", "submit", "reset"])
    .default("button")
    .optional(),
  label: z.string(),
  title: z.string().optional(),
  class: z.string().optional(),
  rel: z.string().optional(),
  icon: z
    .object({
      enable: z.boolean().optional(),
      name: z.string(),
      position: z.enum(["left", "right"]).optional(),
      className: z.string().optional(),
      size: z.string().optional(),
    })
    .optional(),
  target: z.string().optional(),
  hoverEffect: z
    .enum(["text-flip", "creative-fill", "magnetic", "magnetic-text-flip"])
    .optional(),
  variant: z.enum(["fill", "outline", "text", "circle", "white"]).optional(),
});

export const sharedButtonTag = sharedButton.refine(
  (data) => data.tag !== "a" || !!data.url,
  {
    message: "`url` is required when `tag` is 'a'",
    path: ["url"],
  },
);

export const sharedContactItem = z.object({
  title: z.string(),
  icon: z.string(),
  description: z.string(),
  button: sharedButton.optional(),
});

export const ImagePositionEnum = z.enum(["left", "right"]);
export const AppearanceEnum = z.enum(["dark", "light"]);
export const button = sharedButton || sharedButtonTag;

export const videoConfigSchema = z.object({
  src: z.string(),
  type: z.string().optional(),
  provider: z.enum(["youtube", "vimeo", "html5"]).optional(),
  poster: z.string().optional(),
  autoplay: z.boolean().optional(),
  id: z.string().optional(),
});

export const inputFieldSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  halfWidth: z.boolean().optional(),
  defaultValue: z.string().optional(),
  name: z.string().optional(),
  selected: z.boolean().optional(),
  value: z.boolean().optional(),
  checked: z.boolean().optional(),
  type: z.enum(["text", "email", "radio", "checkbox"]).optional(),
  id: z.string().optional(),
  tag: z.literal("textarea").optional(),
  rows: z.string().optional(),
  group: z.string().optional(),
  groupLabel: z.string().optional(),
  items: z
    .array(
      z.object({
        label: z.string(),
        name: z.string().optional(),
        id: z.string().optional(),
        value: z.string().optional(),
        required: z.boolean().optional(),
        groupLabel: z.string().optional(),
        group: z.string().optional(),
        type: z.enum(["radio", "checkbox"]).optional(),
        halfWidth: z.boolean().optional(),
        defaultValue: z.string().optional(),
        checked: z.boolean().optional(),
      }),
    )
    .optional(),
  dropdown: z
    .object({
      type: z.enum(["select", "search"]).optional(),
      search: z
        .object({
          placeholder: z.string().optional(),
        })
        .optional(),
      items: z.array(
        z.object({
          label: z.string(),
          selected: z.literal(true),
          value: z.string(),
        }),
      ),
    })
    .optional(),
  content: z.string().optional(),
  note: z.enum(["info", "warning", "success", "deprecated", "hint"]).optional(),
  parentClass: z.string().optional(),
});

// ================================================================================
// SECTIONS SCHEMA
// ================================================================================

export const heroSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    subTitle: z.string().optional(),
    titleLine1: z.string().optional(),
    titleLine2: z.string().optional(),
    description: z.string().optional(),
    decorativeImage: z.string().optional(),
    decorativeImageAlt: z.string().optional(),
    arrowDecorationImage: z.string().optional(),
    arrowDecorationImageAlt: z.string().optional(),
    shapeImage: z.string().optional(),
    shapeImageAlt: z.string().optional(),
    slides: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    satisfactionClients: z
      .object({
        enable: z.boolean().default(false).optional(),
        avatars: z.array(z.string()).optional(),
        avatarAlt: z.string().optional(),
        count: z.string().optional(),
        label: z.string().optional(),
      })
      .optional(),
    video: videoConfigSchema.optional(),
    helpDropdown: z
      .object({
        enable: z.boolean().default(false).optional(),
        label: z.string().optional(),
        items: z
          .array(
            z.object({
              label: z.string(),
              url: z.string(),
            }),
          )
          .optional(),
      })
      .optional(),
  })
  .optional();

export const heroSectionTwoSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    subTitle: z.string().optional(),
    titleLine1: z.string().optional(),
    titleLine2: z.string().optional(),
    description: z.string().optional(),
    sinceText: z.string().optional(),
    button: sharedButton.optional(),
    buttonContact: sharedButton.optional(),
    decorativeImage: z.string().optional(),
    decorativeImageAlt: z.string().optional(),
    slides: z
      .array(
        z.object({
          image: z.string(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    video: videoConfigSchema.optional(),
  })
  .optional();

export const featuresGridSchema = z
  .object({
    enable: z.boolean().default(false).optional(),
    title: z.string().optional(),
    cardLayout: z.enum(FEATURED_GRID_CARD_LAYOUT).optional(),

    features: z.array(
      z.object({
        enable: z.boolean().default(false).optional(),
        icon: z.string().optional(),
        title: z.string(),
        description: z.string(),
        backgroundImage: z.string().optional(),
        backgroundImageAlt: z.string().optional(),
      }),
    ),
  })
  .optional();

export const servicesSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    button: sharedButton.optional(),
    cardLayout: z.enum(SERVICE_CARD_LAYOUT).optional(),
    limit: z.number().optional(),
  })
  .optional();

export const statsSectionSchema = z
  .object({
    enable: z.boolean().default(false), // Control the visibility of this section
    backgroundImage: z.string().optional(),
    backgroundImageAlt: z.string().optional(),
    list: z.array(
      z.object({
        prependValue: z.string(),
        value: z.string(),
        appendValue: z.string(),
        label: z.string(),
      }),
    ),
  })
  .optional();

export const aboutSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    list: z
      .array(
        z.object({
          enable: z.boolean().default(true).optional(),
          badge: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          services: z
            .array(
              z.object({
                title: z.string(),
                percent: z.string().optional(),
              }),
            )
            .optional(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
          imageVerticalTitle: z.string().optional(),
          imageSecondary: z.string().optional(),
          imageSecondaryAlt: z.string().optional(),
          leftImagePostion: z.boolean().optional(),
          button: sharedButton.optional(),
          deocrativeScribble: z.string().optional(),
          deocrativeScribbleAlt: z.string().optional(),

          testimonial: z
            .object({
              name: z.string().optional(),
              designation: z.string().optional(),
              image: z.string().optional(),
              review: z.string().optional(),
            })
            .optional(),
        }),
      )
      .optional(),
  })
  .optional();

export const processSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    services: z.array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
      }),
    ),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    imageVerticalTitle: z.string().optional(),
  })
  .optional();

export const ctaVideoSectionSchema = z
  .object({
    enable: z.boolean().default(true).optional(),
    badge: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundImageAlt: z.string().optional(),
    scribbleArrow: z.string().optional(),
    scribbleArrowAlt: z.string().optional(),
    button: sharedButton.optional(),
    video: videoConfigSchema.optional(),
  })
  .optional();
export const testimonialSectionSchema = z
  .object({
    enable: z.boolean().default(false).optional(), // Control the visibility of this section
    badge: z.string().optional(),
    title: z.string().optional(),
    decorativeImage: z.string().optional(),
    decorativeImageAlt: z.string().optional(),
    cardLayout: z.enum(TESTIMONIAL_CARD_LAYOUT).optional(),
  })
  .optional();
export const caseStudiesSectionSchema = z
  .object({
    enable: z.boolean().default(false).optional(), // Control the visibility of this section
    badge: z.string().optional(),
    title: z.string().optional(),
    scribbleShapeImage: z.string().optional(),
    scribbleShapeImageAlt: z.string().optional(),
    button: sharedButton.optional(),
    cardLayout: z.enum(CASESTUDIES_CARD_LAYOUT).optional(),
    limit: z.number().optional(),
  })
  .optional();

export const teamSectionSchema = z
  .object({
    enable: z.boolean().default(false), // Control visibility of this section
    badge: z.string().optional(),
    title: z.string().optional(),
    limit: z.union([z.number(), z.literal(false)]).optional(), // Max number of members to show
  })
  .optional();

export const blogSectionSchema = z
  .object({
    enable: z.boolean().default(false), // Control visibility of this section
    badge: z.string().optional(),
    title: z.string().optional(),
    options: z
      .object({
        layout: z.enum(BLOG_CARD_LAYOUT).optional(),
        limit: z.union([z.number(), z.literal(false)]).optional(), // Max number of members to show
      })
      .optional(),
  })
  .optional();

export const ctaSectionSchema = z
  .object({
    enable: z.boolean().default(false).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    button: sharedButton.optional(),
    backgroundImage: z.string().optional(),
    backgroundImageAlt: z.string().optional(),
    humanImage: z.string().optional(),
    humanImageAlt: z.string().optional(),
  })
  .optional();

// Marquee Section Schema
export const statsMarqueeSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    backgroundImage: z.string().optional(),
    backgroundImageAlt: z.string().optional(),
    shapeImage: z.string().optional(),
    shapeImageAlt: z.string().optional(),
    marquee: z.object({
      elementWidth: z.string().optional(),
      elementWidthAuto: z.boolean().default(true),
      elementWidthInSmallDevices: z.string().optional(),
      pauseOnHover: z.boolean().default(false),
      reverse: z.enum(["reverse", ""]).optional(),
      duration: z.string().default("50s"),
      text: z.string().optional(),
    }),
  })
  .optional();

const faqItem = z.object({
  enable: z.boolean().default(false),
  title: z.string(),
  content: z.string(),
});

export const faqSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    badge: z.string().optional(),
    title: z.string().optional(),
    imageList: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    decorativeShapes: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    list: z.array(faqItem).optional(),
  })
  .optional();

export const contactFormSchema = z.object({
  action: z.string().optional(),
  emailSubject: z.string().optional(),
  note: z.string().optional(),
  submitButton: z.object({
    label: z.string(),
  }),
  inputs: z.array(inputFieldSchema),
});
export const contactSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    badge: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundImageAlt: z.string().optional(),
    decorativeImage: z.string().optional(),
    decorativeImageAlt: z.string().optional(),
    faqList: z.array(faqItem),
    contactBadge: z.string().optional(),
    contactTitle: z.string().optional(),
    list: z.array(
      z.object({
        title: z.string(),
        icon: z.string(),
        settingFieldName: z.string(),
      }),
    ),
    form: contactFormSchema,
  })
  .optional();

export const pricingSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    badge: z.string().optional(),
    title: z.string().optional(),
    decorativeImage: z.string().optional(),
    decorativeImageAlt: z.string().optional(),
    list: z.array(
      z.object({
        enable: z.boolean().default(false),
        name: z.string(),
        description: z.string(),
        price: z.object({
          prependValue: z.string(),
          value: z.string(),
          appendValue: z.string(),
        }),
        features: z.array(z.string()),
        button,
      }),
    ),
  })
  .optional();

export const brandLogosSchema = z
  .object({
    enable: z.boolean().default(false),
    list: z.array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
      }),
    ),
  })
  .optional();

export const ctaBarSectionSchema = z
  .object({
    enable: z.boolean().default(true),
    title: z.string(),
    subTitle: z.string(),
    button: sharedButton.optional(),
    backgroundImage: z.string().optional(),
    backgroundImageAlt: z.string().optional(),
  })
  .optional();

export const ctaGallerySectionSchema = z
  .object({
    enable: z.boolean().default(true),
    badge: z.string().optional(),
    title: z.string(),
    button: sharedButton.optional(),
    list: z.array(
      z.object({
        image: z.string(),
        url: z.string(),
        title: z.string(),
      }),
    ),
  })
  .optional();

export const commentFormSchema = z.object({
  title: z.string().optional(),
  emailSubject: z.string().optional(),
  submitButton: z.object({
    enable: z.boolean().optional(),
    label: z.string(),
  }),
  inputs: z.array(inputFieldSchema),
});
export const commentSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    title: z.string(),
    form: commentFormSchema,
  })
  .optional();

export const sectionsSchema = {
  heroSection: heroSectionSchema,
  heroSectionTwo: heroSectionTwoSchema,
  featuresGrid: featuresGridSchema,
  servicesSection: servicesSectionSchema,
  statsSection: statsSectionSchema,
  aboutSection: aboutSectionSchema,
  processSection: processSectionSchema,
  ctaVideoSection: ctaVideoSectionSchema,
  testimonialSection: testimonialSectionSchema,
  caseStudiesSection: caseStudiesSectionSchema,
  teamSection: teamSectionSchema,
  blogSection: blogSectionSchema,
  ctaSection: ctaSectionSchema,
  statsMarqueeSection: statsMarqueeSectionSchema,
  faqSection: faqSectionSchema,
  contactSection: contactSectionSchema,
  pricingSection: pricingSectionSchema,
  brandLogos: brandLogosSchema,
  ctaBarSection: ctaBarSectionSchema,
  ctaGallerySection: ctaGallerySectionSchema,
  commentSection: commentSectionSchema,
};
