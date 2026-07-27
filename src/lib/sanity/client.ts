import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "8yy9mp89";
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(sanityClient);

export function sanityImageUrl(source: SanityImageSource) {
  return builder.image(source);
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  coverImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  body?: SanityBody[];
  categories?: string[];
  tags?: string[];
  draft?: boolean;
  excludeFromSitemap?: boolean;
}

export type SanityInlineText = Array<{
  _type: "block";
  _key: string;
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: Array<{_type: "span"; _key: string; text: string; marks?: string[]}>;
  markDefs?: Array<{_key: string; _type: string; href?: string; openInNewTab?: boolean}>;
}>;

export type SanityLegacyBodyBlock = SanityInlineText[number];

export type SanityBody =
  | SanityLegacyBodyBlock
  | {
      _type: "articleSection";
      _key: string;
      header?: string;
      headerLevel?: "h2" | "h3";
      paragraphs: SanityInlineText;
    }
  | {
      _type: "articleList";
      _key: string;
      header?: string;
      headerLevel?: "h2" | "h3";
      style: "bullet" | "number";
      items: Array<{text: SanityInlineText}>;
    }
  | { _type: "bodyImage"; _key: string; asset?: unknown; alt?: string }
  | { _type: "divider"; _key: string; style?: string }
  | { _type: "tldr"; _key: string; text: SanityInlineText }
  | { _type: "insightList"; _key: string; heading: string; items: Array<{text: SanityInlineText}> }
  | { _type: "callout"; _key: string; label: string; text: SanityInlineText }
  | { _type: "takeaways"; _key: string; heading: string; items: Array<{text: SanityInlineText}> }
  | { _type: "tableOfContents"; _key: string; title?: string }
  | {
      _type: "faq";
      _key: string;
      heading: string;
      items: Array<{question: string; answer: SanityBody[]}>;
    }
  | {
      _type: "sources";
      _key: string;
      heading: string;
      items: Array<{title: string; url?: string; publisher?: string; publishedAt?: string}>;
    }
  | {
      _type: "framework";
      _key: string;
      heading: string;
      steps: Array<{number: number; title: string; explanation: SanityBody[]}>;
    }
  | {
      _type: "vendorProfile";
      _key: string;
      name: string;
      officialLinks: Array<{label: string; url: string}>;
      marketPosition: string;
      bestFor: string;
      coreStrengths: string[];
      limitations: string[];
      pricing: string;
      selectionCriteria: string[];
    }
  | {
      _type: "useCase";
      _key: string;
      title: string;
      churchProfile: string;
      recommendation: string;
      rationale: string;
      budget: string;
    };

export async function getSanityBlogPost(slug: string) {
  return sanityClient.fetch<SanityBlogPost | null>(
    `*[_type == "blogPost" && slug.current == $slug && !draft][0]{
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      coverImage,
      body,
      categories,
      tags,
      draft,
      excludeFromSitemap
    }`,
    { slug },
  );
}

export async function getSanityBlogPosts() {
  return sanityClient.fetch<SanityBlogPost[]>(
    `*[_type == "blogPost" && !draft && defined(slug.current)] | order(publishedAt desc){
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      coverImage,
      categories,
      tags,
      draft,
      excludeFromSitemap
    }`,
  );
}

export async function getSanityBlogPostsByTaxonomy(
  kind: "category" | "tag",
  value: string,
) {
  const field = kind === "category" ? "categories" : "tags";
  return sanityClient.fetch<SanityBlogPost[]>(
    `*[_type == "blogPost" && !draft && defined(slug.current) && $value in ${field}] | order(publishedAt desc){
      _id, title, slug, publishedAt, excerpt, coverImage, categories, tags, draft, excludeFromSitemap
    }`,
    { value },
  );
}

export async function getSanityBlogSlugs() {
  return sanityClient.fetch<string[]>(
    `*[_type == "blogPost" && !draft && defined(slug.current)].slug.current`,
  );
}
