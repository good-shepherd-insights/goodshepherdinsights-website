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
  owner: "copywriter";
  note: string;
};

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
  pages: ContentPageReport[];
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

  const gaps = pages.flatMap((page) => page.gaps);

  return {
    generatedAt,
    activePageCount: pages.length,
    ignoredGeneratedPages: ignoredGeneratedPages.sort(),
    unclassifiedGeneratedPages: unclassifiedGeneratedPages.sort(),
    summary: {
      totalContentGaps: gaps.length,
      pagesWithContentGaps: pages.filter((page) => page.gaps.length > 0).length,
      gapsByField: countBy(gaps.map((gap) => gap.field)),
    },
    pages: pages.sort((a, b) => a.pathname.localeCompare(b.pathname)),
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
        "siteGlobals.organization.address.streetAddress",
        "Postal street address is not visible in Organization JSON-LD.",
      ),
    );
  }

  if (kind === "home") {
    if (!localBusiness?.telephone) {
      gaps.push(
        gap(
          "organization.telephone",
          "siteGlobals.organization.telephone",
          "Telephone is not visible in homepage LocalBusiness JSON-LD.",
        ),
      );
    }
    if (!localBusiness?.image) {
      gaps.push(
        gap(
          "homePage.image.image",
          "homePage.image.image",
          "Dedicated homepage image is not visible in LocalBusiness JSON-LD.",
        ),
      );
    }
  }

  const imageAltField = socialImageAltField(pathname, kind);
  if (imageAltField && !seo.openGraph["og:image:alt"]) {
    gaps.push(
      gap(
        imageAltField,
        imageAltField,
        "Open Graph and Twitter image alt text is not visible.",
      ),
    );
  }

  if (kind === "blogPost" && blogPost) {
    if (!blogPost.author?.url) {
      gaps.push(
        gap(
          "blogPost.author.url",
          "blogPost.author.url",
          "Author profile URL is not visible in BlogPosting.author.",
        ),
      );
    }
    if (!hasItems(blogPost.author?.sameAs)) {
      gaps.push(
        gap(
          "blogPost.author.sameAs[]",
          "blogPost.author.sameAs[]",
          "Author sameAs URLs are not visible in BlogPosting.author.",
        ),
      );
    }
    if (!hasItems(blogPost.about)) {
      gaps.push(
        gap(
          "blogPost.seo.about[]",
          "blogPost.seo.about[]",
          "Primary article topics are not visible in BlogPosting.about.",
        ),
      );
    }
    if (!hasItems(blogPost.mentions)) {
      gaps.push(
        gap(
          "blogPost.seo.mentions[]",
          "blogPost.seo.mentions[]",
          "Mentioned article entities are not visible in BlogPosting.mentions.",
        ),
      );
    }
  }

  if (kind === "serviceDetail" && service) {
    if (!Array.isArray(service.areaServed)) {
      gaps.push(
        gap(
          "service.schema.areaServed[]",
          "service.schema.areaServed[]",
          "Service-specific areas served are not visible; output currently uses the global fallback.",
        ),
      );
    }
    if (!hasItems(service.audience)) {
      gaps.push(
        gap(
          "service.schema.audience[]",
          "service.schema.audience[]",
          "Service audience segments are not visible in Service JSON-LD.",
        ),
      );
    }
    if (!service.serviceOutput) {
      gaps.push(
        gap(
          "service.schema.serviceOutput",
          "service.schema.serviceOutput",
          "Service output is not visible in Service JSON-LD.",
        ),
      );
    }
    if (!hasItems(service.offers)) {
      gaps.push(
        gap(
          "service.schema.offers[]",
          "service.schema.offers[]",
          "Service offers are not visible in Service JSON-LD.",
        ),
      );
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

function gap(field: string, source: string, note: string): ContentGap {
  return { field, source, owner: "copywriter", note };
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
