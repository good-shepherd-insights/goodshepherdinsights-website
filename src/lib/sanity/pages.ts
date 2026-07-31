import { sanityClient } from "./client";
import { cleanSanityValue } from "./clean";

export type SanityPageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  excludeFromSitemap?: boolean;
};

export type SanityPageData = {
  _id?: string;
  title: string;
  badge?: string;
  badgeSecondary?: string;
  pageType?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  disableTagline?: boolean;
  status?: "published" | "draft";
  draft?: boolean;
  seo?: SanityPageSeo;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  excludeFromSitemap?: boolean;
  [key: string]: unknown;
};

export type SanityGenericPage = SanityPageData & {
  slug: { current: string };
  bodyMarkdown?: string;
  date?: string;
  author?: string;
  categories?: string[];
};

export type SanityCaseStudy = SanityPageData & {
  slug: { current: string };
  weight?: number;
  date?: string;
  datePublished?: string;
  dateModified?: string;
  categories?: string[];
  tags?: string[];
  images?: string[];
  information?: Array<{ label: string; value: string }>;
  bodyMarkdown?: string;
};

export type SanityBlogIndexPage = SanityPageData & {
  searchSection?: {
    title?: string;
    searchPlaceholder?: string;
    noResultsText?: string;
  };
  taxonomyCopy?: {
    categoryTitleSuffix?: string;
    categoryDescriptionPrefix?: string;
    tagTitlePrefix?: string;
    tagDescriptionPrefix?: string;
    paginationTitlePrefix?: string;
  };
};

export type SanityNotFoundPage = {
  title: string;
  heading: string;
  message: string;
  robots?: string;
  button?: {
    enable?: boolean;
    label: string;
    url: string;
    variant?: "fill" | "outline" | "text" | "circle" | "white";
    hoverEffect?:
      | "text-flip"
      | "creative-fill"
      | "magnetic"
      | "magnetic-text-flip";
  };
};

const pageFields = `
  _id,
  title,
  badge,
  badgeSecondary,
  pageType,
  description,
  image,
  imageAlt,
  disableTagline,
  status,
  "draft": status == "draft",
  seo,
  "metaTitle": coalesce(seo.metaTitle, title),
  "metaDescription": seo.metaDescription,
  "keywords": seo.keywords,
  "canonical": seo.canonical,
  "robots": seo.robots,
  "excludeFromSitemap": seo.excludeFromSitemap
`;

const commonSectionFields = `
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

const aboutProjection = `{
  ${pageFields},
  heroSection{${commonSectionFields}},
  featuresGrid{${commonSectionFields}, features},
  aboutSectionTwo{${commonSectionFields}},
  statsSection{${commonSectionFields}},
  teamSection{${commonSectionFields}},
  ctaVideoSection{${commonSectionFields}},
  aboutMetricsSection{${commonSectionFields}},
  testimonialSectionTwo{${commonSectionFields}},
  ctaGallerySection{${commonSectionFields}},
  brandLogos{${commonSectionFields}}
}`;

const faqProjection = `{
  ${pageFields},
  faqSection{${commonSectionFields}},
  statsMarqueeSection{${commonSectionFields}},
  faqSectionTwo{${commonSectionFields}},
  ctaGallerySection{${commonSectionFields}}
}`;

const contactProjection = `{
  ${pageFields},
  contactSection{${commonSectionFields}},
  ctaGallerySection{${commonSectionFields}}
}`;

const caseStudiesIndexProjection = `{
  ${pageFields},
  options,
  statsMarqueeSection{${commonSectionFields}},
  ctaGallerySection{${commonSectionFields}}
}`;

function activeStatusFilter() {
  return import.meta.env.PROD
    ? ' && status == "published"'
    : ' && (!defined(status) || status != "archived")';
}

export async function getSanityAboutPage() {
  return cleanSanityValue(await sanityClient.fetch<SanityPageData | null>(
    `*[_type == "aboutPage" && _id == "about-page"${activeStatusFilter()}][0]${aboutProjection}`,
  ));
}

export async function getSanityFaqPage() {
  return cleanSanityValue(await sanityClient.fetch<SanityPageData | null>(
    `*[_type == "faqPage" && _id == "faq-page"${activeStatusFilter()}][0]${faqProjection}`,
  ));
}

export async function getSanityContactPage() {
  return cleanSanityValue(await sanityClient.fetch<SanityPageData | null>(
    `*[_type == "contactPage" && _id == "contact-page"${activeStatusFilter()}][0]${contactProjection}`,
  ));
}

export async function getSanityGenericPages() {
  return cleanSanityValue(await sanityClient.fetch<SanityGenericPage[]>(
    `*[_type == "genericPage" && defined(slug.current)${activeStatusFilter()}] | order(slug.current asc){
      ${pageFields},
      slug,
      bodyMarkdown,
      date,
      author,
      categories
    }`,
  ));
}

export async function getSanityGenericPage(slug: string) {
  return cleanSanityValue(await sanityClient.fetch<SanityGenericPage | null>(
    `*[_type == "genericPage" && slug.current == $slug${activeStatusFilter()}][0]{
      ${pageFields},
      slug,
      bodyMarkdown,
      date,
      author,
      categories
    }`,
    { slug },
  ));
}

export async function getSanityCaseStudiesIndex() {
  return cleanSanityValue(await sanityClient.fetch<SanityPageData | null>(
    `*[_type == "caseStudiesIndex" && _id == "case-studies-index"${activeStatusFilter()}][0]${caseStudiesIndexProjection}`,
  ));
}

export async function getSanityCaseStudies() {
  return cleanSanityValue(await sanityClient.fetch<SanityCaseStudy[]>(
    `*[_type == "caseStudy" && defined(slug.current)${activeStatusFilter()}] | order(coalesce(weight, 9999) asc, title asc){
      ${pageFields},
      slug,
      weight,
      date,
      datePublished,
      dateModified,
      categories,
      tags,
      images,
      information,
      bodyMarkdown
    }`,
  ));
}

export async function getSanityCaseStudy(slug: string) {
  return cleanSanityValue(await sanityClient.fetch<SanityCaseStudy | null>(
    `*[_type == "caseStudy" && slug.current == $slug${activeStatusFilter()}][0]{
      ${pageFields},
      slug,
      weight,
      date,
      datePublished,
      dateModified,
      categories,
      tags,
      images,
      information,
      bodyMarkdown
    }`,
    { slug },
  ));
}

export async function getSanityBlogIndexPage() {
  return cleanSanityValue(await sanityClient.fetch<SanityBlogIndexPage | null>(
    `*[_type == "blogIndexPage" && _id == "blog-index-page"${activeStatusFilter()}][0]{
      ${pageFields},
      searchSection,
      taxonomyCopy
    }`,
  ));
}

export async function getSanityNotFoundPage() {
  return cleanSanityValue(await sanityClient.fetch<SanityNotFoundPage | null>(
    `*[_type == "notFoundPage" && _id == "not-found-page"][0]{
      title,
      heading,
      message,
      robots,
      button
    }`,
  ));
}

export function toCollectionEntry<
  T extends SanityGenericPage | SanityCaseStudy,
  C extends "pages" | "case-studies",
>(
  item: T,
  collection: C,
) {
  return {
    id: `english/${item.slug.current}`,
    collection,
    data: {
      ...item,
      metaTitle: item.metaTitle || item.seo?.metaTitle || item.title,
      metaDescription: item.metaDescription || item.seo?.metaDescription,
      canonical: item.canonical || item.seo?.canonical,
      robots: item.robots || item.seo?.robots,
      keywords: item.keywords || item.seo?.keywords,
      excludeFromSitemap:
        item.excludeFromSitemap ?? item.seo?.excludeFromSitemap,
    },
  };
}
