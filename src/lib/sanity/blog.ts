import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import { slugifyyy } from "@/lib/utils/textConverter";
import { sanityImageUrl, type SanityBlogPost } from "./client";

export type SanitySeoImage = {
  asset?: {
    _ref: string;
  };
  alt?: string;
};

export const sanityBlogIndexContent = {
  badge: "Insights & Updates",
  title: "Practical guidance on ministry technology",
  metaDescription: "Strategic technology insights for ministries and churches.",
  searchSection: {
    title: "Check our inside News",
    searchPlaceholder: "Search in blog",
  },
};

export const sanityBlogPlaceholder: SanityBlogPost = {
  _id: "sanity-blog-placeholder",
  title: "",
  slug: { current: "" },
  publishedAt: "",
};

export type SanityBlogOptions = {
  layout?: "grid" | "featured" | "horizontal" | "compact";
  columns?: number;
  limit?: number | false;
  search?: boolean;
};

export const blogPostUrl = (post: SanityBlogPost | string, locale?: string) =>
  getLocaleUrlCTM(
    typeof post === "string" ? post : post.slug.current,
    locale,
    "/blog",
  );

export const blogTaxonomyUrl = (
  kind: "category" | "tag",
  value: string,
  locale?: string,
) => getLocaleUrlCTM(slugifyyy(value), locale, `/blog/${kind}`);

export const blogImageUrl = (
  post: SanityBlogPost,
  width = 578,
  height?: number,
) => {
  return blogAssetImageUrl(post.coverImage, width, height);
};

export const blogAssetImageUrl = (
  source: SanitySeoImage | undefined,
  width = 578,
  height?: number,
) => {
  if (!source?.asset) return undefined;
  const image = sanityImageUrl(source.asset)
    .width(width)
    .auto("format");
  return height ? image.height(height).fit("crop").url() : image.url();
};

export const categoryCounts = (posts: SanityBlogPost[]) => {
  const counts = new Map<string, number>();
  posts.forEach((post) =>
    (post.categories || []).forEach((name) =>
      counts.set(name, (counts.get(name) || 0) + 1),
    ),
  );
  return [...counts].map(([name, count]) => ({
    name,
    count,
    slug: slugifyyy(name),
  }));
};

export const tagCounts = (posts: SanityBlogPost[]) => {
  const counts = new Map<string, number>();
  posts.forEach((post) =>
    (post.tags || []).forEach((name) =>
      counts.set(name, (counts.get(name) || 0) + 1),
    ),
  );
  return [...counts].map(([name, count]) => ({
    name,
    count,
    slug: slugifyyy(name),
  }));
};
