import type {
  BlogPosting,
  ImageObject,
  Organization,
  Person,
  Thing,
} from "schema-dts";
import { absoluteUrl } from "@/lib/utils/absoluteUrl";
import config from "../../../.astro/config.generated.json";
import type { AstroGlobal } from "astro";
import type { SanityBlogPost } from "./client";
import { blogAssetImageUrl } from "./blog";

type BuildBlogPostSeoOptions = {
  canonical: string;
  astro: AstroGlobal;
  inLanguage?: string;
};

export type BlogPostSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  keywords: string[];
  image?: string;
  imageAlt?: string;
  socialTitle: string;
  socialDescription: string;
  publishedTime: string;
  modifiedTime: string;
  authorName?: string;
  authorUrl?: string;
  section?: string;
  tags: string[];
  schema: BlogPosting;
};

type SanitySchemaThing = {
  name?: string;
  url?: string;
};

export function buildBlogPostSeo(
  post: SanityBlogPost,
  { canonical, astro, inLanguage = "en-US" }: BuildBlogPostSeoOptions,
): BlogPostSeo {
  const title = post.seo?.metaTitle?.trim() || post.title;
  const description =
    post.seo?.metaDescription?.trim() || post.excerpt?.trim() || "";
  const socialTitle = post.seo?.social?.title?.trim() || title;
  const socialDescription =
    post.seo?.social?.description?.trim() || description;
  const imageSource = post.seo?.social?.image?.asset
    ? post.seo.social.image
    : post.coverImage;
  const image = blogAssetImageUrl(imageSource, 1200, 630);
  const imageAlt =
    post.seo?.social?.imageAlt?.trim() ||
    imageSource?.alt?.trim() ||
    post.title;
  const modifiedTime =
    post.seo?.dateModified || post._updatedAt || post.publishedAt;
  const tags = post.tags || [];
  const keywords = uniqueStrings([...(post.seo?.keywords || []), ...tags]);
  const authorName = post.author?.name?.trim();
  const authorUrl = post.author?.url;
  const authorSameAs = uniqueStrings(post.author?.sameAs || []);
  const section = post.seo?.articleSection?.trim() || post.categories?.[0];
  const images = buildArticleImages(post, astro);
  const about = buildSchemaThings(post.seo?.about);
  const mentions = buildSchemaThings(post.seo?.mentions);

  const author: Person | Organization | undefined = authorName
    ? {
        "@type": "Person",
        name: authorName,
        ...(authorUrl && { url: authorUrl }),
        ...(authorSameAs.length > 0 && { sameAs: authorSameAs }),
      }
    : undefined;

  const schema: BlogPosting = {
    "@type": "BlogPosting",
    "@id": `${canonical}#blogposting`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    headline: post.title,
    description,
    url: canonical,
    ...(images.length > 0 && { image: images }),
    datePublished: post.publishedAt,
    dateModified: modifiedTime,
    ...(author && { author }),
    publisher: {
      "@id": `${config.site.baseUrl}/#organization`,
    },
    ...(section && { articleSection: section }),
    ...(keywords.length > 0 && { keywords }),
    ...(about.length > 0 && { about }),
    ...(mentions.length > 0 && { mentions }),
    inLanguage,
  };

  return {
    title,
    description,
    canonical,
    robots: post.seo?.robots || "index, follow",
    keywords,
    image,
    imageAlt,
    socialTitle,
    socialDescription,
    publishedTime: post.publishedAt,
    modifiedTime,
    authorName,
    authorUrl,
    section,
    tags,
    schema,
  };
}

function buildArticleImages(
  post: SanityBlogPost,
  astro: AstroGlobal,
): ImageObject[] {
  const source = post.coverImage;
  const alt = source?.alt?.trim() || post.title;
  const variants = [
    { width: 1200, height: 675 },
    { width: 1200, height: 900 },
    { width: 1200, height: 1200 },
  ];

  return variants.flatMap(({ width, height }) => {
    const url = blogAssetImageUrl(source, width, height);
    if (!url) return [];
    return [
      {
        "@type": "ImageObject",
        url: absoluteUrl(url, astro),
        width,
        height,
        caption: alt,
      } as unknown as ImageObject,
    ];
  });
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function buildSchemaThings(values: SanitySchemaThing[] | undefined): Thing[] {
  return (values || []).flatMap((value) => {
    const name = value.name?.trim();
    const url = value.url?.trim();
    if (!name) return [];

    return [
      {
        "@type": "Thing",
        name,
        ...(url && { url }),
      } as Thing,
    ];
  });
}
