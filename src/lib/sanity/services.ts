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
  serviceType?: string;
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

export const sanityServicesIndexContent = {
  badge: "Our Services",
  title: "Strategic Technology Leadership for Churches",
  metaDescription:
    "Stop administrative overload from burning out your best people. We design the workflow architecture that turns manual tasks into automated systems, protecting your team's calling.",
  image: "/images/page-header/default.png",
};

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
  const image =
    imageOrService && "heroImage" in imageOrService
      ? imageOrService.heroImage
      : imageOrService;
  const asset = image?.image?.asset;
  if (!asset) return undefined;

  const builder = sanityImageUrl(asset).width(width).auto("format");
  return height ? builder.height(height).fit("crop").url() : builder.url();
};
