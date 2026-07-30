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

export interface SiteGlobals {
  _id: string;
  brand: GlobalBrand;
  contact: GlobalContact;
  socialLinks: SocialLink[];
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

const navigationFields = `
  enable,
  name,
  url,
  weight,
  rel,
  target
`;

export async function getSiteGlobals() {
  return sanityClient.fetch<SiteGlobals | null>(
    `*[_type == "siteGlobals" && _id == "site-globals"][0]{
      _id,
      brand,
      contact,
      socialLinks[]{
        enable,
        label,
        url
      },
      header{
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
      footer{
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
  );
}

export const enabledItems = <T extends { enable?: boolean }>(
  items?: T[],
): T[] => (items || []).filter((item) => item.enable !== false);
