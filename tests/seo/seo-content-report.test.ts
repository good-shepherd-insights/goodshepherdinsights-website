import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { readBuiltPages } from "./lib/distReader";
import {
  buildContentReport,
  CONTENT_VISIBILITY_FIELDS,
  writeContentReport,
} from "./lib/contentReport";

describe("SEO content visibility report", () => {
  it("writes the current live-page CMS content gap report", () => {
    const report = buildContentReport(readBuiltPages());

    writeContentReport(report);

    expect(report.activePageCount).toBeGreaterThan(0);
    expect(report.pages.length).toBe(report.activePageCount);
    expect(report.unclassifiedGeneratedPages).toEqual([]);
    expect(report.summary.totalContentGaps).toBe(
      report.pages.flatMap((page) => page.gaps).length,
    );
    expect(Object.keys(report.summary.gapsByField).sort()).toEqual(
      unique(
        report.pages.flatMap((page) => page.gaps.map((gap) => gap.field)),
      ).sort(),
    );

    const allowedFields = new Set(CONTENT_VISIBILITY_FIELDS);
    for (const page of report.pages) {
      expect(page.url).toBeTruthy();
      expect(page.kind).toBeTruthy();
      expect(page.schemaTypes.length).toBeGreaterThan(0);
      for (const gap of page.gaps) {
        expect(allowedFields.has(gap.field as any)).toBe(true);
        expect(gap.owner).toBe("copywriter");
        expect(gap.field).toBeTruthy();
        expect(gap.source).toBeTruthy();
        expect(gap.note).toBeTruthy();
      }
    }
  });

  it("overwrites a parseable report artifact instead of leaving stale output", () => {
    const outputDir = mkdtempSync(path.join(tmpdir(), "seo-content-report-"));
    const outputPath = path.join(outputDir, "report.json");
    const report = buildContentReport([completeHomePage()]);

    writeContentReport({ ...report, generatedAt: "first" }, outputPath);
    writeContentReport({ ...report, generatedAt: "second" }, outputPath);

    expect(JSON.parse(readFileSync(outputPath, "utf8")).generatedAt).toBe(
      "second",
    );
    rmSync(outputDir, { recursive: true, force: true });
  });

  it("does not report gaps when all tracked homepage content is visible", () => {
    const report = buildContentReport([completeHomePage()]);

    expect(report.activePageCount).toBe(1);
    expect(report.pages[0].gaps).toEqual([]);
  });

  it("reports exact blog partial-object gaps without inventing present fields", () => {
    const report = buildContentReport([
      builtPage(
        "/blog/example/",
        jsonLdGraph([
          organization({ streetAddress: "123 Main St" }),
          {
            "@type": "WebPage",
            "@id": "https://goodshepherdinsights.com/blog/example/#webpage",
            name: "Example",
            description: "Example description",
            url: "https://goodshepherdinsights.com/blog/example/",
          },
          {
            "@type": "BlogPosting",
            "@id": "https://goodshepherdinsights.com/blog/example/#blogposting",
            headline: "Example",
            description: "Example description",
            author: {
              "@type": "Person",
              name: "Author",
            },
            about: [{ "@type": "Thing", name: "Church technology" }],
            mentions: [
              {
                "@type": "Thing",
                url: "https://example.com/entity",
              },
            ],
          },
        ]),
      ),
    ]);

    expect(gapFields(report)).toEqual([
      "blogPost.author.sameAs[]",
      "blogPost.author.url",
      "blogPost.seo.about[].url",
      "blogPost.seo.mentions[].name",
    ]);
  });

  it("reports exact service partial-object gaps without hiding subfields", () => {
    const report = buildContentReport([
      builtPage(
        "/services/example/",
        jsonLdGraph([
          organization({ streetAddress: "123 Main St" }),
          {
            "@type": "WebPage",
            "@id": "https://goodshepherdinsights.com/services/example/#webpage",
            name: "Example service",
            description: "Example service description",
            url: "https://goodshepherdinsights.com/services/example/",
          },
          {
            "@type": "Service",
            "@id": "https://goodshepherdinsights.com/services/example/#service",
            name: "Example service",
            description: "Example service description",
            serviceType: "Consulting Service",
            areaServed: [
              { "@type": "State", name: "Maryland" },
              { name: "DC" },
            ],
            audience: [{ name: "Executive pastors" }, {}],
            offers: [
              {
                "@type": "Offer",
                name: "Discovery sprint",
              },
            ],
          },
        ]),
      ),
    ]);

    expect(gapFields(report)).toEqual([
      "service.schema.areaServed[].type",
      "service.schema.audience[].name",
      "service.schema.offers[].description",
      "service.schema.offers[].url",
      "service.schema.serviceOutput",
    ]);
  });

  it("keeps ignored and unclassified generated pages explicit", () => {
    const report = buildContentReport([
      completeHomePage(),
      builtPage("/case-studies/", jsonLdGraph([])),
      builtPage("/unexpected/", jsonLdGraph([])),
    ]);

    expect(report.activePageCount).toBe(1);
    expect(report.ignoredGeneratedPages).toEqual(["/case-studies/"]);
    expect(report.unclassifiedGeneratedPages).toEqual(["/unexpected/"]);
  });
});

function completeHomePage() {
  return builtPage(
    "/",
    jsonLdGraph([
      organization({ streetAddress: "123 Main St" }),
      {
        "@type": "WebPage",
        "@id": "https://goodshepherdinsights.com/#webpage",
        name: "Home",
        description: "Home description",
        url: "https://goodshepherdinsights.com/",
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://goodshepherdinsights.com/#localbusiness",
        name: "Good Shepherd Insights",
        description: "Home description",
        url: "https://goodshepherdinsights.com/",
        telephone: "(240) 441-5259",
        image: "https://goodshepherdinsights.com/images/home.jpg",
      },
    ]),
  );
}

function builtPage(pathname: string, jsonLd: string) {
  const canonical = `https://goodshepherdinsights.com${pathname}`;

  return {
    filePath: `dist${pathname}index.html`,
    pathname,
    html: `<!doctype html>
      <html lang="en">
        <head>
          <title>Example</title>
          <meta name="description" content="Example description">
          <meta name="robots" content="index, follow">
          <link rel="canonical" href="${canonical}">
          <meta property="og:title" content="Example">
          <meta property="og:description" content="Example description">
          <meta property="og:type" content="website">
          <meta property="og:url" content="${canonical}">
          <meta property="og:image" content="https://goodshepherdinsights.com/images/social.jpg">
          <meta property="og:image:alt" content="Social image alt">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="Example">
          <meta name="twitter:description" content="Example description">
          <meta name="twitter:image" content="https://goodshepherdinsights.com/images/social.jpg">
          <meta name="twitter:image:alt" content="Social image alt">
          <script type="application/ld+json">${jsonLd}</script>
        </head>
        <body></body>
      </html>`,
  };
}

function jsonLdGraph(nodes: any[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  });
}

function organization(address: { streetAddress?: string } = {}) {
  return {
    "@type": "Organization",
    "@id": "https://goodshepherdinsights.com/#organization",
    name: "Good Shepherd Insights",
    url: "https://goodshepherdinsights.com/",
    logo: {
      "@type": "ImageObject",
      url: "https://goodshepherdinsights.com/logo.svg",
    },
    address: {
      "@type": "PostalAddress",
      ...address,
    },
  };
}

function gapFields(report: ReturnType<typeof buildContentReport>) {
  return report.pages
    .flatMap((page) => page.gaps.map((gap) => gap.field))
    .sort();
}

function unique(values: string[]) {
  return [...new Set(values)];
}
