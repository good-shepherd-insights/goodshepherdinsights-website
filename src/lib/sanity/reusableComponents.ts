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
    `*[_type == "defaultCtaSection" && _id == "cta-section"][0].content{
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
  decorativeScribble,
  decorativeScribbleAlt,
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

const sectionTypeBySlug: Record<string, string> = {
  "about-section-two": "defaultAboutSectionTwo",
  "about-metrics-section": "defaultAboutMetricsSection",
  "stats-section": "defaultStatsSection",
  "stats-marquee-section": "defaultStatsMarqueeSection",
  "team-section": "defaultTeamSection",
  "testimonial-section": "defaultTestimonialSection",
  "testimonial-section-two": "defaultTestimonialSectionTwo",
  "faq-section": "defaultFaqSection",
  "faq-section-two": "defaultFaqSectionTwo",
  "contact-section": "defaultContactSection",
  "contact-section-two": "defaultContactSectionTwo",
  "cta-gallery-section": "defaultCtaGallerySection",
  "cta-video-section": "defaultCtaVideoSection",
  "cta-video-section-two": "defaultCtaVideoSectionTwo",
  "cta-bar-section": "defaultCtaBarSection",
  "hero-section-two": "defaultHeroSectionTwo",
  "social-bar-section": "defaultSocialBarSection",
  "brand-logos": "defaultBrandLogos",
  "pricing-section": "defaultPricingSection",
  "case-studies-section": "defaultCaseStudiesSection",
  "blog-section": "defaultBlogSection",
  "blog-section-two": "defaultBlogSectionTwo",
};

export const isReusableSectionSlug = (sectionSlug: string) =>
  sectionSlug in sectionTypeBySlug;

export async function getReusableSection<T = Record<string, unknown>>(
  sectionSlug: string,
): Promise<T | null> {
  const docType = sectionTypeBySlug[sectionSlug];
  if (!docType) return null;

  const section = await sanityClient.fetch<T | null>(
    `*[_type == $docType && _id == $sectionSlug][0].content{
      ${reusableSectionFields},
      "backgroundImage": coalesce(backgroundImage.image.asset->url, backgroundImage),
      "backgroundImageAlt": coalesce(backgroundImage.alt, backgroundImageAlt),
      "humanImage": select(
        defined(humanImage.image.asset->url) => humanImage.image.asset->url + "?w=180&h=242&fit=max&auto=format",
        humanImage
      ),
      "humanImageAlt": coalesce(humanImage.alt, humanImageAlt)
    }`,
    {docType, sectionSlug},
  );
  return cleanSanityValue(section);
}
