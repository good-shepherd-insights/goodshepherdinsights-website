import { sanityClient } from "./client";
import type { ReusableButton } from "./reusableComponents";

export interface HomeHeroSection {
  enable?: boolean;
  subTitle?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  arrowDecorationImage?: string;
  arrowDecorationImageAlt?: string;
  shapeImage?: string;
  shapeImageAlt?: string;
  slides?: Array<{
    image: string;
    alt?: string;
  }>;
  satisfactionClients?: {
    enable?: boolean;
    avatars?: string[];
    avatarAlt?: string;
    count?: string;
    label?: string;
  };
  video?: {
    src: string;
    type?: string;
    provider?: "youtube" | "vimeo" | "html5";
    poster?: string;
    autoplay?: boolean;
    id?: string;
  };
  helpDropdown?: {
    enable?: boolean;
    label?: string;
    items?: Array<{
      label: string;
      url: string;
    }>;
  };
}

export interface HomeServicesSection {
  enable: boolean;
  badge?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  button?: ReusableButton;
  cardLayout?: "horizontal" | "listImage";
  limit?: number;
}

export interface HomeAboutSection {
  enable: boolean;
  list?: Array<{
    enable?: boolean;
    badge?: string;
    title?: string;
    description?: string;
    services?: Array<{
      title: string;
      percent?: string;
    }>;
    image?: string;
    imageAlt?: string;
    imageVerticalTitle?: string;
    leftImagePostion?: boolean;
  }>;
}

export interface HomeBlogSection {
  enable: boolean;
  badge?: string;
  title?: string;
  options?: {
    layout?: "grid" | "featured" | "horizontal" | "compact";
    limit?: number | false;
  };
}

export interface SanityHomePage {
  _id: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  pageType?: string;
  disableTagline?: boolean;
  image?: string;
  imageAlt?: string;
  canonical?: string;
  keywords?: string[];
  robots?: string;
  excludeFromSitemap?: boolean;
  heroSection?: HomeHeroSection;
  servicesSection?: HomeServicesSection;
  aboutSection?: HomeAboutSection;
  blogSection?: HomeBlogSection;
}

const freshClient = sanityClient.withConfig({ useCdn: false });

export async function getSanityHomePage() {
  return freshClient.fetch<SanityHomePage | null>(
    `*[_type == "homePage" && _id == "home-page"][0]{
      _id,
      title,
      "metaTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription,
      pageType,
      disableTagline,
      "image": image.image.asset->url,
      "imageAlt": image.alt,
      "canonical": seo.canonical,
      "keywords": seo.keywords,
      "robots": seo.robots,
      "excludeFromSitemap": seo.excludeFromSitemap,
      heroSection{
        enable,
        subTitle,
        titleLine1,
        titleLine2,
        description,
        "arrowDecorationImage": arrowDecorationImage.image.asset->url,
        "arrowDecorationImageAlt": arrowDecorationImage.alt,
        "shapeImage": shapeImage.image.asset->url,
        "shapeImageAlt": shapeImage.alt,
        "slides": slides[]{
          "image": image.image.asset->url,
          "alt": image.alt
        },
        satisfactionClients{
          enable,
          "avatars": avatars[].image.asset->url,
          avatarAlt,
          count,
          label
        },
        video{
          src,
          type,
          provider,
          "poster": poster.image.asset->url,
          autoplay,
          id
        },
        helpDropdown
      },
      servicesSection{
        enable,
        badge,
        title,
        description,
        "image": image.image.asset->url,
        "imageAlt": image.alt,
        button,
        cardLayout,
        limit
      },
      aboutSection{
        enable,
        "list": list[]{
          enable,
          badge,
          title,
          description,
          services,
          "image": image.image.asset->url,
          "imageAlt": image.alt,
          imageVerticalTitle,
          leftImagePostion
        }
      },
      blogSection
    }`,
  );
}
