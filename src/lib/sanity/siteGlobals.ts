import { sanityClient } from "./client";

export interface GlobalButton {
  enable: boolean;
  label: string;
  url: string;
  variant?: "fill" | "outline" | "text" | "circle" | "white";
  hoverEffect?:
    | "text-flip"
    | "creative-fill"
    | "magnetic"
    | "magnetic-text-flip";
  rel?: string;
  target?: string;
}

export interface GlobalBrand {
  title: string;
  logoPath: string;
  logoAlternatePath?: string;
  logoText?: string;
  logoWidth?: string;
  logoHeight?: string;
}

export interface GlobalContact {
  addressText: string;
  phoneLabel: string;
  phoneHref: string;
  emailLabel: string;
  emailHref: string;
  mapEmbedUrl?: string;
}

export interface SocialLink {
  enable: boolean;
  label: string;
  url: string;
}

export interface NavigationChildItem {
  enable: boolean;
  name: string;
  url: string;
  weight?: number;
  rel?: string;
  target?: string;
}

export interface NavigationItem {
  enable: boolean;
  name: string;
  url?: string;
  weight?: number;
  rel?: string;
  target?: string;
  hasChildren?: boolean;
  children?: NavigationChildItem[];
}

export interface ImageWithAlt {
  image: { asset: { _ref: string; _type: "reference" }; _type: "image" };
  alt: string;
  caption?: string;
}

export interface GlobalFaviconItem {
  rel: string;
  type?: string;
  sizes?: string;
  purpose?: string;
  color?: string;
  image: ImageWithAlt;
}

export interface SiteGlobals {
  _id: string;
  brand: GlobalBrand;
  contact: GlobalContact;
  socialLinks: SocialLink[];
  seoDefaults?: {
    author?: string;
    title?: string;
    description?: string;
    tagline?: string;
    taglineSeparator?: string;
    baseUrl?: string;
    defaultImage?: string;
    pageHeaderDefaultImage?: string;
    faviconSet?: GlobalFaviconItem[];
    keywords?: string[];
    robots?: string;
    ogLocale?: string;
    ogType?: string;
    twitter?: string;
    twitterCard?: string;
    themeColorLight?: string;
    themeColorDark?: string;
    headContent?: string;
  };
  organization?: {
    name?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
    };
    email?: string;
    telephone?: string;
    logo?: string;
  };
  indexing?: {
    robotsTxt?: {
      enable?: boolean;
      disallow?: string[];
    };
    sitemap?: {
      enable?: boolean;
      exclude?: string[];
    };
  };
  forms?: {
    contactFormProvider?: string;
    contactFormAction?: string;
    subscriptionFormAction?: string;
    mailchimpTagValue?: string;
    messages?: {
      missingAction?: string;
      subscribeSuccess?: string;
      subscribeError?: string;
      subscribeNetworkError?: string;
    };
  };
  uiCopy?: {
    copy?: string;
  };
  appManifest?: {
    name?: string;
    shortName?: string;
    themeColor?: string;
    backgroundColor?: string;
    display?: string;
    icons?: Array<{
      sizes?: string;
      type?: string;
      purpose?: string;
      image: ImageWithAlt;
    }>;
  };
  header: {
    primaryNavigation: NavigationItem[];
    navigationButton?: GlobalButton;
    topBar?: {
      workingHoursLabel?: string;
      workingHoursValue?: string;
      callLabel?: string;
      hotLineLabel?: string;
      letsChatLabel?: string;
    };
    announcementBar?: {
      enable?: boolean;
      label?: string;
    };
    offcanvas?: {
      enable?: boolean;
      description?: string;
      button?: GlobalButton;
    };
  };
  footer: {
    primary?: {
      description?: string;
      supportLabel?: string;
      servicesHeading?: string;
      contactHeading?: string;
      workHourLabel?: string;
      workHourValue?: string;
      sinceText?: string;
      navigation?: NavigationChildItem[];
    };
    secondary?: {
      description?: string;
      callUsLabel?: string;
      subscription?: {
        enable?: boolean;
        title?: string;
        note?: string;
        formAction?: string;
        mailchimpTagValue?: string;
        emailPlaceholder?: string;
        submitLabel?: string;
      };
      navigation?: NavigationChildItem[];
    };
    copyright?: {
      enable?: boolean;
      text?: string;
    };
  };
}

let siteGlobalsPromise: Promise<SiteGlobals | null> | null = null;

const navigationFields = `
  enable,
  name,
  url,
  weight,
  rel,
  target
`;

export async function getSiteGlobals() {
  siteGlobalsPromise ??= sanityClient
    .fetch<(SiteGlobals & { brand?: GlobalBrand }) | null>(
      `{
        "_id": "site-globals",
        "brand": *[_type == "brand" && _id == "brand"][0]{
          title, logoPath, logoAlternatePath, logoText, logoWidth, logoHeight
        },
        "contact": *[_type == "contact" && _id == "contact"][0]{
          addressText, phoneLabel, phoneHref, emailLabel, emailHref, mapEmbedUrl
        },
        "seoDefaults": *[_type == "seoDefaults" && _id == "seo-defaults"][0]{
          author, title, description, tagline, taglineSeparator, baseUrl, defaultImage,
          pageHeaderDefaultImage, faviconSet, keywords, robots, ogLocale, ogType, twitter,
          twitterCard, themeColorLight, themeColorDark, headContent
        },
        "organization": *[_type == "organization" && _id == "organization"][0]{
          name, address, email, telephone, logo
        },
        "indexing": *[_type == "indexing" && _id == "indexing"][0]{
          robotsTxt, sitemap
        },
        "forms": *[_type == "forms" && _id == "forms"][0]{
          contactFormProvider, contactFormAction, subscriptionFormAction, mailchimpTagValue, messages
        },
        "uiCopy": *[_type == "uiCopy" && _id == "ui-copy"][0]{
          copy
        },
        "appManifest": *[_type == "appManifest" && _id == "app-manifest"][0]{
          name, shortName, themeColor, backgroundColor, display, icons
        },
        "socialLinks": *[_type == "socialLinks" && _id == "social-links"][0].links[]{
          enable,
          label,
          url
        },
        "header": *[_type == "header" && _id == "header"][0]{
          primaryNavigation[] | order(weight asc, name asc){
            ${navigationFields},
            "hasChildren": count(children[enable != false]) > 0,
            children[enable != false] | order(weight asc, name asc){
              ${navigationFields}
            }
          },
          navigationButton,
          topBar,
          announcementBar,
          offcanvas
        },
        "footer": *[_type == "footer" && _id == "footer"][0]{
          primary{
            description,
            supportLabel,
            servicesHeading,
            contactHeading,
            workHourLabel,
            workHourValue,
            sinceText,
            navigation[enable != false] | order(weight asc, name asc){
              ${navigationFields}
            }
          },
          secondary{
            description,
            callUsLabel,
            subscription,
            navigation[enable != false] | order(weight asc, name asc){
              ${navigationFields}
            }
          },
          copyright
        }
      }`,
    )
    .then((result) => (result?.brand ? (result as SiteGlobals) : null));

  return siteGlobalsPromise;
}

export const enabledItems = <T extends { enable?: boolean }>(
  items?: T[],
): T[] => (items || []).filter((item) => item.enable !== false);
