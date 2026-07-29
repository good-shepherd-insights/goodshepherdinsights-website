import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import { sanityClient, sanityImageUrl, type SanityInlineText } from "./client";

export interface SanityImageWithAlt {
  image?: {
    asset?: { _ref: string };
  };
  alt?: string;
  caption?: string;
}

export interface SanityServiceTextItem {
  text: SanityInlineText;
}

export type SanityServiceBlock =
  | {
      _type: "serviceIntro";
      _key: string;
      title?: string;
      text: SanityInlineText;
    }
  | {
      _type: "serviceNarrative";
      _key: string;
      heading?: string;
      text: SanityInlineText;
    }
  | {
      _type: "statCallout";
      _key: string;
      value: string;
      label?: string;
      description?: string;
    }
  | {
      _type: "serviceOffering";
      _key: string;
      number?: number;
      title: string;
      description: SanityInlineText;
      audience?: string[];
      deliverables?: SanityServiceTextItem[];
      methodologySteps?: SanityServiceTextItem[];
      statCallouts?: Array<
        Extract<SanityServiceBlock, { _type: "statCallout" }>
      >;
      outcomesTitle?: string;
      outcomes?: SanityServiceTextItem[];
    }
  | {
      _type: "serviceCta";
      _key: string;
      title: string;
      text?: SanityInlineText;
      linkText: string;
      href: string;
    }
  | {
      _type: "serviceImage";
      _key: string;
      image: SanityImageWithAlt;
      video?: {
        src?: string;
        provider?: "youtube" | "vimeo" | "html5";
        id?: string;
      };
    };

export interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  status?: "draft" | "published";
  order?: number;
  excerpt?: string;
  serviceType: string;
  heroImage?: SanityImageWithAlt;
  body?: SanityServiceBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
    excludeFromSitemap?: boolean;
  };
}

export interface SanityServicesIndex {
  _id: string;
  badge?: string;
  title: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  servicesList?: {
    enable?: boolean;
    layout?: "horizontal" | "listImage";
    limit?: number;
  };
  featureGrid?: ServiceFeatureGridSection;
  statsMarquee?: ServiceStatsMarqueeSection;
  processSection?: ServiceProcessSection;
  ctaVideoSection?: ServiceCtaVideoSection;
  ctaSection?: ServiceCtaSection;
  faqSection?: ServiceFaqSection;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
    excludeFromSitemap?: boolean;
  };
}

export interface ServiceButton {
  enable: boolean;
  label: string;
  url: string;
  variant?: "fill" | "outline" | "text" | "circle" | "white";
  hoverEffect?:
    "text-flip" | "creative-fill" | "magnetic" | "magnetic-text-flip";
}

export interface ServiceFeatureGridSection {
  enable?: boolean;
  badge?: string;
  title?: string;
  cardLayout?: "outsideIcon" | "insideIcon" | "outsideIconSquare";
  features: Array<{
    enable?: boolean;
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ServiceStatsMarqueeSection {
  enable: boolean;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  shapeImage?: string;
  shapeImageAlt?: string;
  marquee: {
    elementWidthAuto: boolean;
    pauseOnHover: boolean;
    reverse?: "" | "reverse";
    duration: string;
    text?: string;
  };
}

export interface ServiceProcessSection {
  enable: boolean;
  badge?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  services: Array<{
    title: string;
    description?: string;
    icon?: string;
  }>;
}

export interface ServiceCtaVideoSection {
  enable: boolean;
  badge?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  scribbleArrow?: string;
  scribbleArrowAlt?: string;
  button?: ServiceButton;
  video?: {
    src: string;
    provider?: "youtube" | "vimeo" | "html5";
    id?: string;
    autoplay?: boolean;
  };
}

export interface ServiceCtaSection {
  enable: boolean;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  humanImage?: string;
  humanImageAlt?: string;
  button?: ServiceButton;
}

export interface ServiceFaqSection {
  enable: boolean;
  title?: string;
  list?: Array<{
    enable?: boolean;
    title: string;
    content: string;
  }>;
}

const serviceFields = `
  _id,
  title,
  slug,
  status,
  order,
  excerpt,
  serviceType,
  heroImage,
  body,
  seo
`;

export async function getSanityServices() {
  return sanityClient.fetch<SanityService[]>(
    `*[_type == "service" && status == "published" && defined(slug.current)] | order(order asc, title asc){
      ${serviceFields}
    }`,
  );
}

export async function getSanityService(slug: string) {
  return sanityClient.fetch<SanityService | null>(
    `*[_type == "service" && status == "published" && slug.current == $slug][0]{
      ${serviceFields}
    }`,
    { slug },
  );
}

export async function getSanityServicesIndex() {
  return sanityClient.fetch<SanityServicesIndex | null>(
    `*[_type == "serviceIndex" && _id == "service-index"][0]{
      _id,
      badge,
      title,
      excerpt,
      "image": heroImage.image.asset->url,
      "imageAlt": heroImage.alt,
      servicesList,
      featureGrid,
      statsMarquee{
        enable,
        "backgroundImage": backgroundImage.image.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        "shapeImage": shapeImage.image.asset->url,
        "shapeImageAlt": shapeImage.alt,
        marquee
      },
      processSection{
        enable,
        badge,
        title,
        description,
        "image": image.image.asset->url,
        "imageAlt": image.alt,
        services
      },
      ctaVideoSection{
        enable,
        badge,
        title,
        description,
        "backgroundImage": backgroundImage.image.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        scribbleArrow,
        scribbleArrowAlt,
        button,
        video
      },
      ctaSection{
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
      },
      faqSection,
      seo
    }`,
  );
}

export async function getSanityServiceSlugs() {
  return sanityClient.fetch<string[]>(
    `*[_type == "service" && status == "published" && defined(slug.current)].slug.current`,
  );
}

export const serviceUrl = (service: SanityService | string, locale?: string) =>
  getLocaleUrlCTM(
    typeof service === "string" ? service : service.slug.current,
    locale,
    "/services",
  );

export const serviceImageUrl = (
  imageOrService?: SanityImageWithAlt | SanityService,
  width = 900,
  height?: number,
) => {
  const image = (
    imageOrService && "heroImage" in imageOrService
      ? imageOrService.heroImage
      : imageOrService
  ) as SanityImageWithAlt | undefined;
  const asset = image?.image?.asset;
  if (!asset) return undefined;

  const builder = sanityImageUrl(asset).width(width).auto("format");
  return height ? builder.height(height).fit("crop").url() : builder.url();
};
