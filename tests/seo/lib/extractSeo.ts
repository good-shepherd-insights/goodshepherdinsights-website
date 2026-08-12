import * as cheerio from "cheerio";

export type SeoOutput = {
  htmlLang?: string;
  title?: string;
  titleTags: string[];
  description?: string;
  descriptionTags: string[];
  robots?: string;
  robotsTags: string[];
  canonicalLinks: string[];
  openGraph: Record<string, string>;
  openGraphTags: Record<string, string[]>;
  twitter: Record<string, string>;
  twitterTags: Record<string, string[]>;
  article: Record<string, string>;
  articleTags: Record<string, string[]>;
  jsonLd: unknown[];
};

export function extractSeo(html: string, sourceLabel = "HTML document"): SeoOutput {
  const $ = cheerio.load(html);
  const jsonLd: unknown[] = [];

  $('script[type="application/ld+json"]').each((index, script) => {
    try {
      jsonLd.push(JSON.parse($(script).text() || "{}"));
    } catch (error) {
      throw new Error(
        `${sourceLabel} has invalid JSON-LD in script ${index + 1}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  });

  return {
    htmlLang: $("html").attr("lang")?.trim(),
    title: $("title").first().text().trim(),
    titleTags: $("title")
      .map((_, title) => $(title).text().trim())
      .get(),
    description: $('meta[name="description"]').attr("content")?.trim(),
    descriptionTags: $('meta[name="description"]')
      .map((_, meta) => $(meta).attr("content")?.trim() ?? "")
      .get(),
    robots: $('meta[name="robots"]').attr("content")?.trim(),
    robotsTags: $('meta[name="robots"]')
      .map((_, meta) => $(meta).attr("content")?.trim() ?? "")
      .get(),
    canonicalLinks: $('link[rel="canonical"]')
      .map((_, link) => $(link).attr("href")?.trim() ?? "")
      .get(),
    openGraph: extractMeta($, "property", "og:"),
    openGraphTags: extractMetaValues($, "property", "og:"),
    twitter: extractMeta($, "name", "twitter:"),
    twitterTags: extractMetaValues($, "name", "twitter:"),
    article: extractMeta($, "property", "article:"),
    articleTags: extractMetaValues($, "property", "article:"),
    jsonLd,
  };
}

function extractMeta(
  $: cheerio.CheerioAPI,
  keyAttribute: "name" | "property",
  prefix: string,
) {
  const values: Record<string, string> = {};

  $(`meta[${keyAttribute}^="${prefix}"]`).each((_, meta) => {
    const key = $(meta).attr(keyAttribute) || "";
    const value = $(meta).attr("content")?.trim() || "";
    if (key.startsWith(prefix) && value) values[key] = value;
  });

  return values;
}

function extractMetaValues(
  $: cheerio.CheerioAPI,
  keyAttribute: "name" | "property",
  prefix: string,
) {
  const values: Record<string, string[]> = {};

  $(`meta[${keyAttribute}^="${prefix}"]`).each((_, meta) => {
    const key = $(meta).attr(keyAttribute) || "";
    const value = $(meta).attr("content")?.trim() || "";
    if (!key.startsWith(prefix)) return;

    values[key] ||= [];
    values[key].push(value);
  });

  return values;
}
