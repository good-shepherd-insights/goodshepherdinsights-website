import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  classifyLivePath,
  type LivePageKind,
  isIgnoredGeneratedPath,
  SITE_ORIGIN,
} from "./contracts";
import type { BuiltPage } from "./distReader";
import { extractSeo, type SeoOutput } from "./extractSeo";
import {
  findNodeByType,
  flattenSchemaNodes,
  schemaTypes,
  type SchemaNode,
} from "./schemaGraph";

export type ContentGap = {
  field: string;
  source: string;
  owner: ContentGapOwner;
  note: string;
};

export type ContentGapOwner = "business" | "copywriter" | "engineering";

export type ContentPageReport = {
  url: string;
  pathname: string;
  kind: LivePageKind;
  title?: string;
  metaDescription?: string;
  canonical?: string;
  robots?: string;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  twitter: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  schemaTypes: string[];
  gaps: ContentGap[];
};

export type ListedContentGap = ContentGap & {
  url: string;
  pathname: string;
  kind: LivePageKind;
};

export type ContentReport = {
  generatedAt: string;
  activePageCount: number;
  ignoredGeneratedPages: string[];
  unclassifiedGeneratedPages: string[];
  summary: {
    totalContentGaps: number;
    pagesWithContentGaps: number;
    gapsByField: Record<string, number>;
  };
  contentGaps: ListedContentGap[];
  pages: ContentPageReport[];
};

export const CONTENT_VISIBILITY_FIELDS = [
  "organization.address.streetAddress",
  "organization.telephone",
  "homePage.image.image",
  "homePage.image.alt",
  "aboutPage.imageAlt",
  "blogIndexPage.imageAlt",
  "contactPage.imageAlt",
  "faqPage.imageAlt",
  "genericPage.imageAlt",
  "blogPost.author.url",
  "blogPost.author.sameAs[]",
  "blogPost.seo.about[].name",
  "blogPost.seo.about[].url",
  "blogPost.seo.mentions[].name",
  "blogPost.seo.mentions[].url",
  "service.schema.areaServed[].name",
  "service.schema.areaServed[].type",
  "service.schema.audience[].name",
  "service.schema.serviceOutput",
  "service.schema.offers[].name",
  "service.schema.offers[].description",
  "service.schema.offers[].url",
] as const;

export type ContentVisibilityField = (typeof CONTENT_VISIBILITY_FIELDS)[number];

const CONTENT_FIELD_OWNERS: Record<ContentVisibilityField, ContentGapOwner> = {
  "organization.address.streetAddress": "business",
  "organization.telephone": "business",
  "homePage.image.image": "copywriter",
  "homePage.image.alt": "copywriter",
  "aboutPage.imageAlt": "copywriter",
  "blogIndexPage.imageAlt": "copywriter",
  "contactPage.imageAlt": "copywriter",
  "faqPage.imageAlt": "copywriter",
  "genericPage.imageAlt": "copywriter",
  "blogPost.author.url": "business",
  "blogPost.author.sameAs[]": "business",
  "blogPost.seo.about[].name": "copywriter",
  "blogPost.seo.about[].url": "copywriter",
  "blogPost.seo.mentions[].name": "copywriter",
  "blogPost.seo.mentions[].url": "copywriter",
  "service.schema.areaServed[].name": "business",
  "service.schema.areaServed[].type": "business",
  "service.schema.audience[].name": "business",
  "service.schema.serviceOutput": "business",
  "service.schema.offers[].name": "business",
  "service.schema.offers[].description": "business",
  "service.schema.offers[].url": "business",
};

export function buildContentReport(
  builtPages: BuiltPage[],
  generatedAt = new Date().toISOString(),
): ContentReport {
  const ignoredGeneratedPages: string[] = [];
  const unclassifiedGeneratedPages: string[] = [];
  const pages: ContentPageReport[] = [];

  for (const builtPage of builtPages) {
    const contract = classifyLivePath(builtPage.pathname);
    if (!contract) {
      if (isIgnoredGeneratedPath(builtPage.pathname)) {
        ignoredGeneratedPages.push(builtPage.pathname);
      } else {
        unclassifiedGeneratedPages.push(builtPage.pathname);
      }
      continue;
    }

    const seo = extractSeo(builtPage.html, builtPage.pathname);
    const nodes = flattenSchemaNodes(seo.jsonLd);
    const canonical = seo.canonicalLinks[0];

    pages.push({
      url: canonical || `${SITE_ORIGIN}${builtPage.pathname}`,
      pathname: builtPage.pathname,
      kind: contract.kind,
      title: seo.title,
      metaDescription: seo.description,
      canonical,
      robots: seo.robots,
      openGraph: {
        title: seo.openGraph["og:title"],
        description: seo.openGraph["og:description"],
        image: seo.openGraph["og:image"],
        imageAlt: seo.openGraph["og:image:alt"],
      },
      twitter: {
        title: seo.twitter["twitter:title"],
        description: seo.twitter["twitter:description"],
        image: seo.twitter["twitter:image"],
        imageAlt: seo.twitter["twitter:image:alt"],
      },
      schemaTypes: schemaTypes(nodes),
      gaps: contentGapsForPage(builtPage.pathname, contract.kind, seo, nodes),
    });
  }

  const sortedPages = pages.sort((a, b) =>
    a.pathname.localeCompare(b.pathname),
  );
  const contentGaps = sortedPages.flatMap((page) =>
    page.gaps.map((gap) => ({
      url: page.url,
      pathname: page.pathname,
      kind: page.kind,
      ...gap,
    })),
  );

  return {
    generatedAt,
    activePageCount: sortedPages.length,
    ignoredGeneratedPages: ignoredGeneratedPages.sort(),
    unclassifiedGeneratedPages: unclassifiedGeneratedPages.sort(),
    summary: {
      totalContentGaps: contentGaps.length,
      pagesWithContentGaps: sortedPages.filter((page) => page.gaps.length > 0)
        .length,
      gapsByField: countBy(contentGaps.map((gap) => gap.field)),
    },
    contentGaps,
    pages: sortedPages,
  };
}

export function writeContentReport(
  report: ContentReport,
  outputPath = ".context/seo-content-report.json",
) {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
}

function contentGapsForPage(
  pathname: string,
  kind: LivePageKind,
  seo: SeoOutput,
  nodes: SchemaNode[],
) {
  const gaps: ContentGap[] = [];
  const organization = findNodeByType(nodes, "Organization");
  const localBusiness = findNodeByType(nodes, "LocalBusiness");
  const blogPost = findNodeByType(nodes, "BlogPosting");
  const service = findNodeByType(nodes, "Service");

  if (!organization?.address?.streetAddress) {
    gaps.push(
      gap(
        "organization.address.streetAddress",
        "Postal street address is not visible in Organization JSON-LD.",
      ),
    );
  }

  if (kind === "home") {
    if (!localBusiness?.telephone) {
      gaps.push(
        gap(
          "organization.telephone",
          "Telephone is not visible in homepage LocalBusiness JSON-LD.",
        ),
      );
    }
    if (!localBusiness?.image) {
      gaps.push(
        gap(
          "homePage.image.image",
          "Dedicated homepage image is not visible in LocalBusiness JSON-LD.",
        ),
      );
    }
  }

  const imageAltField = socialImageAltField(pathname, kind);
  if (
    imageAltField &&
    (!seo.openGraph["og:image:alt"] || !seo.twitter["twitter:image:alt"])
  ) {
    const missingTargets = [
      !seo.openGraph["og:image:alt"] ? "Open Graph" : undefined,
      !seo.twitter["twitter:image:alt"] ? "Twitter" : undefined,
    ].filter(Boolean);

    gaps.push(
      gap(
        imageAltField,
        `${missingTargets.join(" and ")} image alt text is not visible.`,
      ),
    );
  }

  if (kind === "blogPost" && blogPost) {
    if (!blogPost.author?.url) {
      gaps.push(
        gap(
          "blogPost.author.url",
          "Author profile URL is not visible in BlogPosting.author.",
        ),
      );
    }
    if (!hasItems(blogPost.author?.sameAs)) {
      gaps.push(
        gap(
          "blogPost.author.sameAs[]",
          "Author sameAs URLs are not visible in BlogPosting.author.",
        ),
      );
    }
    if (!hasItems(blogPost.about)) {
      gaps.push(
        gap(
          "blogPost.seo.about[].name",
          "Primary article topic names are not visible in BlogPosting.about.",
        ),
      );
      gaps.push(
        gap(
          "blogPost.seo.about[].url",
          "Primary article topic URLs are not visible in BlogPosting.about.",
        ),
      );
    } else {
      for (const item of blogPost.about) {
        if (!item?.name) {
          gaps.push(
            gap(
              "blogPost.seo.about[].name",
              "A primary article topic is missing a visible name.",
            ),
          );
        }
        if (!item?.url) {
          gaps.push(
            gap(
              "blogPost.seo.about[].url",
              "A primary article topic is missing a visible URL.",
            ),
          );
        }
      }
    }
    if (!hasItems(blogPost.mentions)) {
      gaps.push(
        gap(
          "blogPost.seo.mentions[].name",
          "Mentioned article entity names are not visible in BlogPosting.mentions.",
        ),
      );
      gaps.push(
        gap(
          "blogPost.seo.mentions[].url",
          "Mentioned article entity URLs are not visible in BlogPosting.mentions.",
        ),
      );
    } else {
      for (const item of blogPost.mentions) {
        if (!item?.name) {
          gaps.push(
            gap(
              "blogPost.seo.mentions[].name",
              "A mentioned article entity is missing a visible name.",
            ),
          );
        }
        if (!item?.url) {
          gaps.push(
            gap(
              "blogPost.seo.mentions[].url",
              "A mentioned article entity is missing a visible URL.",
            ),
          );
        }
      }
    }
  }

  if (kind === "serviceDetail" && service) {
    if (!Array.isArray(service.areaServed)) {
      gaps.push(
        gap(
          "service.schema.areaServed[].name",
          "Service-specific area-served names are not visible; output currently uses the global fallback.",
        ),
      );
      gaps.push(
        gap(
          "service.schema.areaServed[].type",
          "Service-specific area-served types are not visible; output currently uses the global fallback.",
        ),
      );
    } else {
      for (const item of service.areaServed) {
        if (!item?.name) {
          gaps.push(
            gap(
              "service.schema.areaServed[].name",
              "A service-specific area served is missing a visible name.",
            ),
          );
        }
        if (!item?.["@type"]) {
          gaps.push(
            gap(
              "service.schema.areaServed[].type",
              "A service-specific area served is missing a visible schema type.",
            ),
          );
        }
      }
    }
    if (!hasItems(service.audience)) {
      gaps.push(
        gap(
          "service.schema.audience[].name",
          "Service audience segment names are not visible in Service JSON-LD.",
        ),
      );
    } else {
      for (const item of service.audience) {
        if (!item?.name) {
          gaps.push(
            gap(
              "service.schema.audience[].name",
              "A service audience segment is missing a visible name.",
            ),
          );
        }
      }
    }
    if (!service.serviceOutput) {
      gaps.push(
        gap(
          "service.schema.serviceOutput",
          "Service output is not visible in Service JSON-LD.",
        ),
      );
    }
    if (!hasItems(service.offers)) {
      gaps.push(
        gap(
          "service.schema.offers[].name",
          "Service offer names are not visible in Service JSON-LD.",
        ),
      );
      gaps.push(
        gap(
          "service.schema.offers[].description",
          "Service offer descriptions are not visible in Service JSON-LD.",
        ),
      );
      gaps.push(
        gap(
          "service.schema.offers[].url",
          "Service offer URLs are not visible in Service JSON-LD.",
        ),
      );
    } else {
      for (const item of service.offers) {
        if (!item?.name) {
          gaps.push(
            gap(
              "service.schema.offers[].name",
              "A service offer is missing a visible name.",
            ),
          );
        }
        if (!item?.description) {
          gaps.push(
            gap(
              "service.schema.offers[].description",
              "A service offer is missing a visible description.",
            ),
          );
        }
        if (!item?.url) {
          gaps.push(
            gap(
              "service.schema.offers[].url",
              "A service offer is missing a visible URL.",
            ),
          );
        }
      }
    }
  }

  return gaps;
}

function socialImageAltField(pathname: string, kind: LivePageKind) {
  if (kind === "home") return "homePage.image.alt";
  if (pathname === "/about/") return "aboutPage.imageAlt";
  if (kind === "blogIndex") return "blogIndexPage.imageAlt";
  if (kind === "contact") return "contactPage.imageAlt";
  if (kind === "faq") return "faqPage.imageAlt";
  if (pathname === "/privacy-policy/") return "genericPage.imageAlt";
  if (pathname === "/terms-conditions/") return "genericPage.imageAlt";
  return undefined;
}

function gap(field: ContentVisibilityField, note: string): ContentGap {
  return { field, source: field, owner: CONTENT_FIELD_OWNERS[field], note };
}

function hasItems(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}
