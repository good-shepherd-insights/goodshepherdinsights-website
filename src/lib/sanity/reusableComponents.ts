import { sanityClient } from "./client";
import { cleanSanityValue } from "./clean";

export interface ReusableButton {
  enable: boolean;
  label: string;
  url: string;
  tag?: "a" | "button";
  buttonType?: "button" | "submit" | "reset";
  title?: string;
  rel?: string;
  target?: string;
  icon?: {
    enable?: boolean;
    name: string;
    position?: "left" | "right";
    className?: string;
    size?: string;
  };
  variant?: "fill" | "outline" | "text" | "circle" | "white";
  hoverEffect?:
    "text-flip" | "creative-fill" | "magnetic" | "magnetic-text-flip";
}

export interface ReusableCtaSection {
  enable: boolean;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  humanImage?: string;
  humanImageAlt?: string;
  button?: ReusableButton;
}

export async function getReusableCtaSection() {
  const section = await sanityClient.fetch<ReusableCtaSection | null>(
    `*[_type == "reusableComponents" && _id == "reusable-components"][0].ctaSection{
      enable,
      title,
      description,
      "backgroundImage": backgroundImage.image.asset->url,
      "backgroundImageAlt": backgroundImage.alt,
      "humanImage": select(
        defined(humanImage.image.asset->url) => humanImage.image.asset->url + "?w=180&h=242&fit=max&auto=format",
        null
      ),
      "humanImageAlt": humanImage.alt,
      button
    }`,
  );
  return cleanSanityValue(section);
}

const reusableSectionFields = `
  enable,
  badge,
  title,
  subTitle,
  description,
  contactTitle,
  contactBadge,
  searchPlaceholder,
  backgroundImage,
  backgroundImageAlt,
  decorativeImage,
  decorativeImageAlt,
  decorativeImage,
  deocrativeScribble,
  deocrativeScribbleAlt,
  arrowShapeImage,
  arrowShapeImageAlt,
  scribbleImage,
  scribbleImageAlt,
  scribbleArrow,
  scribbleArrowAlt,
  scribbleShapeImage,
  scribbleShapeImageAlt,
  shapeImage,
  shapeImageAlt,
  image,
  imageAlt,
  imageSecondary,
  imageSecondaryAlt,
  sinceText,
  cardLayout,
  limit,
  button,
  buttonContact,
  list,
  faqList,
  imageList,
  decorativeShapes,
  form,
  marquee,
  video,
  slides,
  options
`;

const sectionFieldBySlug: Record<string, string> = {
  "about-section-two": "aboutSectionTwo",
  "about-metrics-section": "aboutMetricsSection",
  "stats-section": "statsSection",
  "stats-marquee-section": "statsMarqueeSection",
  "team-section": "teamSection",
  "testimonial-section": "testimonialSection",
  "testimonial-section-two": "testimonialSectionTwo",
  "faq-section": "faqSection",
  "faq-section-two": "faqSectionTwo",
  "contact-section": "contactSection",
  "contact-section-two": "contactSectionTwo",
  "cta-gallery-section": "ctaGallerySection",
  "cta-video-section": "ctaVideoSection",
  "cta-video-section-two": "ctaVideoSectionTwo",
  "cta-bar-section": "ctaBarSection",
  "hero-section-two": "heroSectionTwo",
  "social-bar-section": "socialBarSection",
  "brand-logos": "brandLogos",
  "pricing-section": "pricingSection",
  "case-studies-section": "caseStudiesSection",
  "blog-section": "blogSection",
  "blog-section-two": "blogSectionTwo",
};

export const isReusableSectionSlug = (sectionSlug: string) =>
  sectionSlug in sectionFieldBySlug;

export async function getReusableSection<T = Record<string, unknown>>(
  sectionSlug: string,
): Promise<T | null> {
  const field = sectionFieldBySlug[sectionSlug];
  if (!field) return null;

  const section = await sanityClient.fetch<T | null>(
    `*[_type == "reusableComponents" && _id == "reusable-components"][0].${field}{
      ${reusableSectionFields},
      "backgroundImage": coalesce(backgroundImage.image.asset->url, backgroundImage),
      "backgroundImageAlt": coalesce(backgroundImage.alt, backgroundImageAlt),
      "humanImage": select(
        defined(humanImage.image.asset->url) => humanImage.image.asset->url + "?w=180&h=242&fit=max&auto=format",
        humanImage
      ),
      "humanImageAlt": coalesce(humanImage.alt, humanImageAlt)
    }`,
  );
  return cleanSanityValue(section);
}
