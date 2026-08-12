import { existsSync, readFileSync } from "node:fs";
import ts from "typescript";
import {
  classifyLivePath,
  type LivePageContract,
  isIgnoredGeneratedPath,
  SITE_ORIGIN,
} from "./lib/contracts";
import {
  parseRobotsTxt,
  readBuiltPages,
  readRobotsTxt,
  readSitemapEntries,
  readSitemapFilePaths,
  readSitemapXmlReferences,
  readSitemapUrls,
  sitemapUrlToDistPath,
} from "./lib/distReader";
import { extractSeo } from "./lib/extractSeo";
import {
  assertAbsoluteIds,
  assertJsonLdDocuments,
  findNodeById,
  findNodeByType,
  findNodesByType,
  flattenSchemaNodes,
  idReference,
  schemaTypes,
} from "./lib/schemaGraph";
import { buildServiceSchema } from "../../src/lib/seo/service";
import { schemaGraph } from "../../src/lib/seo/types";
import type { SanityService } from "../../src/lib/sanity/services";

const builtPages = readBuiltPages();
const sitemapEntries = readSitemapEntries();
const sitemapFilePaths = readSitemapFilePaths();
const sitemapXmlReferences = readSitemapXmlReferences();
const sitemapUrls = readSitemapUrls();
const robotsTxt = readRobotsTxt();
const robotsRules = parseRobotsTxt(robotsTxt);
const pageOutputs = builtPages.map((page) => ({
  ...page,
  contract: classifyLivePath(page.pathname),
  seo: extractSeo(page.html, page.pathname),
}));
const livePageOutputs = pageOutputs.filter((page) => page.contract);
const pagesByCanonical = new Map(
  pageOutputs
    .filter((page) => page.seo.canonicalLinks.length === 1)
    .map((page) => [page.seo.canonicalLinks[0], page]),
);
const canonicalForPathname = (pathname: string) => `${SITE_ORIGIN}${pathname}`;

describe("SEO generated output contract", () => {
  it("keeps Service JSON-LD enrichment backed by real CMS fields", () => {
    const schemaFields = nestedSanityFieldNames(
      "studio/schemaTypes/service.ts",
      "schema",
    );
    const serviceProjection = templateLiteralVariableValue(
      "src/lib/sanity/services.ts",
      "serviceFields",
    );

    expectArrayContains(
      schemaFields,
      "areaServed",
      "service.schema must expose areaServed",
    );
    expectArrayContains(
      schemaFields,
      "audience",
      "service.schema must expose audience",
    );
    expectArrayContains(
      schemaFields,
      "serviceOutput",
      "service.schema must expose serviceOutput",
    );
    expectArrayContains(
      schemaFields,
      "offers",
      "service.schema must expose offers",
    );
    expectProjectionField(
      serviceProjection,
      "schema",
      "Sanity service projection must fetch service.schema",
    );
  });

  it("emits populated Service JSON-LD enrichment without fabricating empty facts", () => {
    const completeService: SanityService = {
      _id: "service.complete",
      title: "Complete Service",
      slug: { current: "complete-service" },
      serviceType: "Consulting Service",
      excerpt: "Fallback service description",
      schema: {
        areaServed: [
          { name: "Maryland", type: "State" },
          { name: "Washington, DC", type: "City" },
        ],
        audience: [{ name: "Church executive pastors" }],
        serviceOutput: "A prioritized technology roadmap",
        offers: [
          {
            name: "Discovery sprint",
            description: "A short assessment of current technology risk.",
            url: "https://goodshepherdinsights.com/contact/",
          },
        ],
      },
    };
    const completeNode = firstGraphNode(
      schemaGraph([
        buildServiceSchema({
          service: completeService,
          ids: serviceTestIds(),
          image: "https://goodshepherdinsights.com/images/service.jpg",
        }),
      ]),
    );

    expectSame(
      completeNode.areaServed?.[0]?.["@type"],
      "State",
      "areaServed type must come from CMS",
    );
    expectSame(
      completeNode.areaServed?.[0]?.name,
      "Maryland",
      "areaServed name must come from CMS",
    );
    expectSame(
      completeNode.audience?.[0]?.["@type"],
      "Audience",
      "audience must emit Audience nodes",
    );
    expectSame(
      completeNode.audience?.[0]?.name,
      "Church executive pastors",
      "audience name must come from CMS",
    );
    expectSame(
      completeNode.serviceOutput,
      "A prioritized technology roadmap",
      "serviceOutput must come from CMS",
    );
    expectSame(
      completeNode.offers?.[0]?.["@type"],
      "Offer",
      "offers must emit Offer nodes",
    );
    expectSame(
      completeNode.offers?.[0]?.url,
      "https://goodshepherdinsights.com/contact/",
      "offer URL must come from CMS",
    );

    const emptyNode = firstGraphNode(
      schemaGraph([
        buildServiceSchema({
          service: {
            _id: "service.empty",
            title: "Empty Service",
            slug: { current: "empty-service" },
            serviceType: "Consulting Service",
            excerpt: "Fallback service description",
            schema: {
              areaServed: [{ name: "" }],
              audience: [{ name: "" }],
              offers: [{ name: "", description: "", url: "" }],
            },
          } satisfies SanityService,
          ids: serviceTestIds(),
        }),
      ]),
    );

    expectSame(
      emptyNode.areaServed,
      undefined,
      "empty areaServed values must be omitted",
    );
    expectSame(
      emptyNode.audience,
      undefined,
      "empty audience values must be omitted",
    );
    expectSame(
      emptyNode.serviceOutput,
      undefined,
      "empty serviceOutput must be omitted",
    );
    expectSame(emptyNode.offers, undefined, "empty offers must be omitted");
  });

  it("reads generated sitemap and robots files", () => {
    expectGreaterThan(
      sitemapFilePaths.length,
      0,
      "dist must contain sitemap files",
    );
    expectGreaterThan(sitemapUrls.size, 0, "sitemap must contain URLs");
    expectLength(
      sitemapEntries,
      sitemapUrls.size,
      "sitemap must not contain duplicate live URLs",
    );
    expectGreaterThan(
      robotsRules.userAgents.length,
      0,
      "robots.txt must define a user agent",
    );
    expectGreaterThan(
      robotsRules.sitemaps.length,
      0,
      "robots.txt must reference sitemap",
    );
    for (const sitemap of robotsRules.sitemaps) {
      expectTrue(
        sitemap.startsWith(`${SITE_ORIGIN}/`) && sitemap.endsWith(".xml"),
        `robots.txt sitemap must be an absolute XML URL: ${sitemap}`,
      );
      expectTrue(
        existsSync(sitemapUrlToDistPath(sitemap)),
        `robots.txt sitemap target must exist in dist: ${sitemap}`,
      );
    }
    for (const sitemap of new Set(sitemapXmlReferences)) {
      expectTrue(
        sitemap.startsWith(`${SITE_ORIGIN}/`) && sitemap.endsWith(".xml"),
        `sitemap index reference must be an absolute XML URL: ${sitemap}`,
      );
      expectTrue(
        existsSync(sitemapUrlToDistPath(sitemap)),
        `sitemap index reference must exist in dist: ${sitemap}`,
      );
    }
  });

  it("keeps sitemap entries aligned with generated canonical pages and live route classification", () => {
    const canonicalUrls = new Set(
      pageOutputs.flatMap((page) => page.seo.canonicalLinks),
    );
    const staleSitemapUrls = Array.from(sitemapUrls).filter(
      (url) => !canonicalUrls.has(url),
    );
    const unclassifiedSitemapUrls = Array.from(sitemapUrls).filter((url) => {
      const page = pagesByCanonical.get(url);
      return page && !page.contract;
    });
    const ignoredSitemapUrls = Array.from(sitemapUrls).filter((url) => {
      const page = pagesByCanonical.get(url);
      return page && isIgnoredGeneratedPath(page.pathname);
    });

    expect(staleSitemapUrls).toEqual([]);
    expect(unclassifiedSitemapUrls).toEqual([]);
    expect(ignoredSitemapUrls).toEqual([]);
    expectLength(
      livePageOutputs,
      sitemapUrls.size,
      "live page count must match sitemap URL count",
    );
  });

  it("keeps generated non-live routes explicit instead of silently dropping them", () => {
    const unreviewedGeneratedPages = pageOutputs
      .filter(
        (page) => !page.contract && !isIgnoredGeneratedPath(page.pathname),
      )
      .map((page) => `${page.pathname} (${page.filePath})`);

    expect(unreviewedGeneratedPages).toEqual([]);
  });

  it("emits required metadata and sitemap policy for every live page", () => {
    for (const page of livePageOutputs) {
      const { pathname, contract, seo } = page;
      expect(contract).toBeDefined();
      if (!contract) continue;

      expectTruthy(seo.title, `${pathname} is missing <title>`);
      expectSame(seo.htmlLang, "en", `${pathname} html lang must be en`);
      expectTruthy(seo.description, `${pathname} is missing meta description`);
      expectTruthy(seo.robots, `${pathname} is missing robots meta`);
      expectLength(
        seo.titleTags,
        1,
        `${pathname} must emit exactly one title tag`,
      );
      expectLength(
        seo.descriptionTags,
        1,
        `${pathname} must emit exactly one meta description tag`,
      );
      expectLength(
        seo.robotsTags,
        1,
        `${pathname} must emit exactly one robots meta tag`,
      );
      expectLength(
        seo.canonicalLinks,
        1,
        `${pathname} must emit exactly one canonical link`,
      );

      const canonical = seo.canonicalLinks[0];
      expect(() => new URL(canonical)).not.toThrow();
      expectTrue(
        canonical.startsWith(`${SITE_ORIGIN}/`),
        `${pathname} canonical must use production origin`,
      );
      expectSame(
        canonical,
        canonicalForPathname(pathname),
        `${pathname} canonical must match its generated live path`,
      );

      expectRobotsDirective(pathname, seo.robots);
      expectNotContains(
        seo.robots?.toLowerCase(),
        "noindex",
        `${pathname} live page must not be noindex`,
      );
      expectTrue(
        sitemapUrls.has(canonical),
        `${pathname} live canonical is missing from sitemap`,
      );
      expectTrue(
        !isPathDisallowedByRobots(new URL(canonical).pathname),
        `${pathname} live canonical is disallowed by robots.txt`,
      );
      expectCoreSocialTags(pathname, seo);
      expectRouteSpecificMetadata(pathname, contract.kind, seo);
    }
  });

  it("emits parseable route-specific JSON-LD with coherent ID relationships", () => {
    for (const page of livePageOutputs) {
      const { pathname, contract, seo } = page;
      expect(contract).toBeDefined();
      if (!contract) continue;

      assertJsonLdDocuments(pathname, seo.jsonLd);
      const nodes = flattenSchemaNodes(seo.jsonLd);
      const types = schemaTypes(nodes);

      expectGreaterThan(nodes.length, 0, `${pathname} must emit JSON-LD nodes`);
      assertAbsoluteIds(pathname, nodes);
      expectUniqueSchemaIds(pathname, nodes);
      expectSingletonSchemaTypes(pathname, nodes);
      expectSchemaUrls(pathname, seo.canonicalLinks[0], nodes);

      for (const requiredType of contract.requiredSchemaTypes) {
        expectArrayContains(
          types,
          requiredType,
          `${pathname} is missing ${requiredType} schema`,
        );
      }

      if (contract.requiresBreadcrumb) {
        expectArrayContains(
          types,
          "BreadcrumbList",
          `${pathname} is missing BreadcrumbList`,
        );
      }

      expectSchemaRelationships(pathname, nodes);
      expectPrimaryEntityRelationship(
        pathname,
        seo.canonicalLinks[0],
        contract,
        nodes,
      );
      expectRouteSpecificSchema(pathname, contract.kind, nodes);
    }
  });
});

function expectRouteSpecificMetadata(
  pathname: string,
  kind: string,
  seo: ReturnType<typeof extractSeo>,
) {
  if (kind !== "blogPost") return;

  expectSame(
    seo.openGraph["og:type"],
    "article",
    `${pathname} og:type must be article`,
  );
  for (const key of ["article:published_time", "article:modified_time"]) {
    expectTruthy(seo.article[key], `${pathname} is missing ${key}`);
    expectLength(
      seo.articleTags[key] || [],
      1,
      `${pathname} must emit exactly one ${key}`,
    );
    expectValidDate(
      seo.article[key],
      `${pathname} ${key} must be a valid date`,
    );
  }
}

function serviceTestIds() {
  const canonical = `${SITE_ORIGIN}/services/complete-service/`;

  return {
    baseUrl: `${SITE_ORIGIN}/`,
    canonical,
    website: `${SITE_ORIGIN}/#website`,
    organization: `${SITE_ORIGIN}/#organization`,
    webPage: `${SITE_ORIGIN}/services/complete-service/#webpage`,
    breadcrumb: `${SITE_ORIGIN}/services/complete-service/#breadcrumb`,
    collectionPage: `${SITE_ORIGIN}/services/complete-service/#collectionpage`,
    itemList: `${SITE_ORIGIN}/services/complete-service/#itemlist`,
  };
}

function firstGraphNode(graph: { "@graph": any[] }) {
  const node = graph["@graph"][0];
  expectTruthy(node, "test graph must contain a Service node");
  return node;
}

function expectRouteSpecificSchema(
  pathname: string,
  kind: string,
  nodes: any[],
) {
  if (kind === "home") {
    const localBusiness = findNodeByType(nodes, "LocalBusiness");
    expectTruthy(
      localBusiness?.name,
      `${pathname} LocalBusiness is missing name`,
    );
    expectTruthy(
      localBusiness?.description,
      `${pathname} LocalBusiness is missing description`,
    );
    expectSame(
      localBusiness?.url,
      `${SITE_ORIGIN}/`,
      `${pathname} LocalBusiness.url must be site root`,
    );
    expectOptionalAbsoluteUrls(
      pathname,
      localBusiness?.sameAs,
      "LocalBusiness.sameAs",
    );
    if (localBusiness?.image) {
      expectAbsoluteUrl(pathname, localBusiness.image, "LocalBusiness.image");
    }
    if (localBusiness?.address) {
      expectSame(
        localBusiness.address["@type"],
        "PostalAddress",
        `${pathname} LocalBusiness.address must be PostalAddress`,
      );
    }
  }

  if (kind === "blogPost") {
    const blogPost = findNodeByType(nodes, "BlogPosting");
    expectTruthy(
      blogPost?.headline,
      `${pathname} BlogPosting is missing headline`,
    );
    expectTruthy(
      blogPost?.description,
      `${pathname} BlogPosting is missing description`,
    );
    expectValidDate(
      blogPost?.datePublished,
      `${pathname} BlogPosting.datePublished must be a valid date`,
    );
    expectValidDate(
      blogPost?.dateModified,
      `${pathname} BlogPosting.dateModified must be a valid date`,
    );
    expectSchemaImages(pathname, blogPost?.image, "BlogPosting.image");
  }

  if (kind === "serviceDetail") {
    const service = findNodeByType(nodes, "Service");
    expectTruthy(service?.name, `${pathname} Service is missing name`);
    expectTruthy(
      service?.description,
      `${pathname} Service is missing description`,
    );
    expectTruthy(
      service?.serviceType,
      `${pathname} Service is missing serviceType`,
    );
    expectAbsoluteUrl(pathname, service?.image, "Service.image");
  }

  if (kind === "blogIndex" || kind === "servicesIndex") {
    const itemList = findNodeByType(nodes, "ItemList");
    expectItemList(pathname, itemList, kind);
  }

  if (kind === "faq") {
    const faq = findNodeByType(nodes, "FAQPage");
    const questions = Array.isArray(faq?.mainEntity) ? faq.mainEntity : [];
    for (const [index, question] of questions.entries()) {
      expectSame(
        question["@type"],
        "Question",
        `${pathname} FAQ question ${index + 1} must be Question`,
      );
      expectTruthy(
        question.name,
        `${pathname} FAQ question ${index + 1} is missing name`,
      );
      expectSame(
        question.acceptedAnswer?.["@type"],
        "Answer",
        `${pathname} FAQ answer ${index + 1} must be Answer`,
      );
      expectTruthy(
        question.acceptedAnswer?.text,
        `${pathname} FAQ answer ${index + 1} is missing text`,
      );
    }
  }
}

function expectCoreSocialTags(
  pathname: string,
  seo: ReturnType<typeof extractSeo>,
) {
  for (const key of ["og:title", "og:description", "og:type", "og:url"]) {
    expectTruthy(seo.openGraph[key], `${pathname} is missing ${key}`);
    expectLength(
      seo.openGraphTags[key] || [],
      1,
      `${pathname} must emit exactly one ${key}`,
    );
  }
  expectTruthy(seo.openGraph["og:image"], `${pathname} is missing og:image`);
  expectAbsoluteUrl(pathname, seo.openGraph["og:image"], "og:image");
  expectLength(
    seo.openGraphTags["og:image"] || [],
    1,
    `${pathname} must emit exactly one og:image`,
  );

  expectSame(
    seo.openGraph["og:url"],
    seo.canonicalLinks[0],
    `${pathname} og:url must match canonical`,
  );

  for (const key of [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ]) {
    expectTruthy(seo.twitter[key], `${pathname} is missing ${key}`);
    expectLength(
      seo.twitterTags[key] || [],
      1,
      `${pathname} must emit exactly one ${key}`,
    );
  }
  expectAbsoluteUrl(pathname, seo.twitter["twitter:image"], "twitter:image");
}

function nestedSanityFieldNames(sourcePath: string, parentFieldName: string) {
  const sourceFile = parseSourceFile(sourcePath);
  let parentField: ts.ObjectLiteralExpression | undefined;

  visitNodes(sourceFile, (node) => {
    if (!ts.isCallExpression(node)) return;
    if (
      !ts.isIdentifier(node.expression) ||
      node.expression.text !== "defineField"
    ) {
      return;
    }
    const [fieldDefinition] = node.arguments;
    if (!fieldDefinition || !ts.isObjectLiteralExpression(fieldDefinition))
      return;
    if (objectStringProperty(fieldDefinition, "name") === parentFieldName) {
      parentField = fieldDefinition;
    }
  });

  expectTruthy(
    parentField,
    `${sourcePath} is missing Sanity field ${parentFieldName}`,
  );

  return arrayProperty(parentField, "fields").flatMap((field) => {
    if (!ts.isCallExpression(field)) return [];
    const [fieldDefinition] = field.arguments;
    if (!fieldDefinition || !ts.isObjectLiteralExpression(fieldDefinition))
      return [];
    return objectStringProperty(fieldDefinition, "name") || [];
  });
}

function templateLiteralVariableValue(
  sourcePath: string,
  variableName: string,
) {
  const sourceFile = parseSourceFile(sourcePath);
  let value = "";

  visitNodes(sourceFile, (node) => {
    if (!ts.isVariableDeclaration(node)) return;
    if (!ts.isIdentifier(node.name) || node.name.text !== variableName) return;
    const initializer = node.initializer;
    if (!initializer) return;
    if (ts.isNoSubstitutionTemplateLiteral(initializer)) {
      value = initializer.text;
    }
  });

  expectTruthy(
    value,
    `${sourcePath} is missing template variable ${variableName}`,
  );
  return value;
}

function expectProjectionField(
  projection: string,
  fieldName: string,
  message: string,
) {
  const fields = projection
    .split("\n")
    .map((line) => line.trim().replace(/,$/, ""))
    .filter(Boolean);

  expectArrayContains(fields, fieldName, message);
}

function parseSourceFile(sourcePath: string) {
  return ts.createSourceFile(
    sourcePath,
    readFileSync(sourcePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
}

function visitNodes(
  sourceFile: ts.SourceFile,
  callback: (node: ts.Node) => void,
) {
  const visit = (node: ts.Node) => {
    callback(node);
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

function objectStringProperty(
  object: ts.ObjectLiteralExpression,
  propertyName: string,
) {
  const property = object.properties.find(
    (item): item is ts.PropertyAssignment => {
      if (!ts.isPropertyAssignment(item)) return false;
      return propertyNameText(item.name) === propertyName;
    },
  );
  const initializer = property?.initializer;

  return initializer && ts.isStringLiteral(initializer)
    ? initializer.text
    : undefined;
}

function arrayProperty(
  object: ts.ObjectLiteralExpression | undefined,
  propertyName: string,
) {
  if (!object) return [];

  const property = object.properties.find(
    (item): item is ts.PropertyAssignment => {
      if (!ts.isPropertyAssignment(item)) return false;
      return propertyNameText(item.name) === propertyName;
    },
  );
  const initializer = property?.initializer;

  return initializer && ts.isArrayLiteralExpression(initializer)
    ? [...initializer.elements]
    : [];
}

function propertyNameText(name: ts.PropertyName) {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }

  return undefined;
}

function expectSchemaRelationships(pathname: string, nodes: any[]) {
  const website = findNodeByType(nodes, "WebSite");
  const organization = findNodeByType(nodes, "Organization");
  const webPage = findNodeByType(nodes, "WebPage");
  const collectionPage = findNodeByType(nodes, "CollectionPage");
  const itemList = findNodeByType(nodes, "ItemList");
  const service = findNodeByType(nodes, "Service");
  const blogPost = findNodeByType(nodes, "BlogPosting");
  const article = findNodeByType(nodes, "Article");
  const contactPage = findNodeByType(nodes, "ContactPage");

  expectGlobalSchema(pathname, website, organization);

  if (webPage) {
    expectSame(
      findNodeById(nodes, idReference(webPage.isPartOf)),
      website,
      `${pathname} WebPage.isPartOf must reference emitted WebSite`,
    );
  }

  if (collectionPage) {
    expectSame(
      findNodeById(nodes, idReference(collectionPage.mainEntity)),
      itemList,
      `${pathname} CollectionPage.mainEntity must reference emitted ItemList`,
    );
  }

  if (service) {
    expectSame(
      findNodeById(nodes, idReference(service.mainEntityOfPage)),
      webPage,
      `${pathname} Service.mainEntityOfPage must reference emitted WebPage`,
    );
    expectSame(
      findNodeById(nodes, idReference(service.provider)),
      organization,
      `${pathname} Service.provider must reference emitted Organization`,
    );
  }

  if (blogPost) {
    expectSame(
      findNodeById(nodes, idReference(blogPost.mainEntityOfPage)),
      webPage,
      `${pathname} BlogPosting.mainEntityOfPage must reference emitted WebPage`,
    );
    expectSame(
      findNodeById(nodes, idReference(blogPost.publisher)),
      organization,
      `${pathname} BlogPosting.publisher must reference emitted Organization`,
    );
  }

  if (article) {
    expectSame(
      findNodeById(nodes, idReference(article.publisher)),
      organization,
      `${pathname} Article.publisher must reference emitted Organization`,
    );
  }

  if (contactPage) {
    expectSame(
      findNodeById(nodes, idReference(contactPage.mainEntity)),
      organization,
      `${pathname} ContactPage.mainEntity must reference emitted Organization`,
    );
  }

  const breadcrumb = findNodeByType(nodes, "BreadcrumbList");
  if (breadcrumb) {
    expectBreadcrumb(pathname, breadcrumb);
  }
}

function expectPrimaryEntityRelationship(
  pathname: string,
  canonical: string,
  contract: LivePageContract,
  nodes: any[],
) {
  if (!contract.primaryEntity) return;

  const webPage = findNodeByType(nodes, "WebPage");
  const primaryEntity = findNodeByType(nodes, contract.primaryEntity.type);
  const expectedId = `${canonical.replace(/\/+$/, "")}/#${contract.primaryEntity.fragment}`;

  expectSame(
    primaryEntity?.["@id"],
    expectedId,
    `${pathname} ${contract.primaryEntity.type} @id must match route contract`,
  );
  expectSame(
    findNodeById(nodes, idReference(webPage?.mainEntity)),
    primaryEntity,
    `${pathname} WebPage.mainEntity must reference emitted ${contract.primaryEntity.type}`,
  );
}

function expectGlobalSchema(pathname: string, website: any, organization: any) {
  expectSame(
    website?.["@id"],
    `${SITE_ORIGIN}/#website`,
    `${pathname} WebSite @id must be stable`,
  );
  expectSame(
    website?.url,
    `${SITE_ORIGIN}/`,
    `${pathname} WebSite.url must be site root`,
  );
  expectTruthy(website?.name, `${pathname} WebSite is missing name`);

  expectSame(
    organization?.["@id"],
    `${SITE_ORIGIN}/#organization`,
    `${pathname} Organization @id must be stable`,
  );
  expectSame(
    organization?.url,
    `${SITE_ORIGIN}/`,
    `${pathname} Organization.url must be site root`,
  );
  expectTruthy(organization?.name, `${pathname} Organization is missing name`);
  expectAbsoluteUrl(pathname, organization?.logo?.url, "Organization.logo.url");
}

function expectItemList(pathname: string, itemList: any, kind: string) {
  const items = Array.isArray(itemList?.itemListElement)
    ? itemList.itemListElement
    : [];
  const expectedType = kind === "servicesIndex" ? "Service" : "BlogPosting";

  expectGreaterThan(items.length, 0, `${pathname} ItemList must contain items`);
  items.forEach((listItem: any, index: number) => {
    expectSame(
      listItem["@type"],
      "ListItem",
      `${pathname} ItemList entry ${index + 1} must be ListItem`,
    );
    expectSame(
      listItem.position,
      index + 1,
      `${pathname} ItemList positions must be sequential`,
    );
    expectSame(
      listItem.item?.["@type"],
      expectedType,
      `${pathname} ItemList entry ${index + 1} must point to ${expectedType}`,
    );
    expectTruthy(
      listItem.item?.name,
      `${pathname} ItemList entry ${index + 1} is missing name`,
    );
    expectAbsoluteUrl(
      pathname,
      listItem.item?.url,
      `ItemList entry ${index + 1} url`,
    );
    expectAbsoluteUrl(
      pathname,
      listItem.item?.["@id"],
      `ItemList entry ${index + 1} @id`,
    );
  });
}

function expectSchemaImages(pathname: string, value: unknown, label: string) {
  const images = Array.isArray(value) ? value : value ? [value] : [];

  expectGreaterThan(
    images.length,
    0,
    `${pathname} ${label} must contain images`,
  );
  images.forEach((image, index) => {
    if (typeof image === "string") {
      expectAbsoluteUrl(pathname, image, `${label} ${index + 1}`);
      return;
    }

    expectSame(
      image?.["@type"],
      "ImageObject",
      `${pathname} ${label} ${index + 1} must be ImageObject`,
    );
    expectAbsoluteUrl(pathname, image?.url, `${label} ${index + 1} url`);
  });
}

function expectSchemaUrls(pathname: string, canonical: string, nodes: any[]) {
  const ids = expectedSchemaIds(canonical);
  const webPage = findNodeByType(nodes, "WebPage");
  const collectionPage = findNodeByType(nodes, "CollectionPage");
  const itemList = findNodeByType(nodes, "ItemList");
  const service = findNodeByType(nodes, "Service");
  const blogPost = findNodeByType(nodes, "BlogPosting");
  const contactPage = findNodeByType(nodes, "ContactPage");
  const faqPage = findNodeByType(nodes, "FAQPage");
  const localBusiness = findNodeByType(nodes, "LocalBusiness");

  if (webPage) {
    expectSame(webPage["@id"], ids.webPage, `${pathname} WebPage @id drifted`);
    expectSame(
      webPage.url,
      canonical,
      `${pathname} WebPage.url must match canonical`,
    );
    expectTruthy(
      webPage.description,
      `${pathname} WebPage is missing description`,
    );
  }
  if (collectionPage) {
    expectSame(
      collectionPage["@id"],
      ids.collectionPage,
      `${pathname} CollectionPage @id drifted`,
    );
    expectSame(
      collectionPage.url,
      canonical,
      `${pathname} CollectionPage.url must match canonical`,
    );
    expectTruthy(
      collectionPage.description,
      `${pathname} CollectionPage is missing description`,
    );
  }
  if (itemList) {
    expectSame(
      itemList["@id"],
      ids.itemList,
      `${pathname} ItemList @id drifted`,
    );
    expectGreaterThan(
      Array.isArray(itemList.itemListElement)
        ? itemList.itemListElement.length
        : 0,
      0,
      `${pathname} ItemList must contain listed items`,
    );
  }
  if (service) {
    expectSame(service["@id"], ids.service, `${pathname} Service @id drifted`);
    expectSame(
      service.url,
      canonical,
      `${pathname} Service.url must match canonical`,
    );
  }
  if (blogPost) {
    expectSame(
      blogPost["@id"],
      ids.blogPosting,
      `${pathname} BlogPosting @id drifted`,
    );
    expectSame(
      blogPost.url,
      canonical,
      `${pathname} BlogPosting.url must match canonical`,
    );
  }
  if (contactPage) {
    expectSame(
      contactPage["@id"],
      ids.contactPage,
      `${pathname} ContactPage @id drifted`,
    );
    expectSame(
      contactPage.url,
      canonical,
      `${pathname} ContactPage.url must match canonical`,
    );
    expectTruthy(
      contactPage.description,
      `${pathname} ContactPage is missing description`,
    );
  }
  if (faqPage) {
    expectSame(faqPage["@id"], ids.faqPage, `${pathname} FAQPage @id drifted`);
    expectTruthy(
      faqPage.description,
      `${pathname} FAQPage is missing description`,
    );
    expectGreaterThan(
      Array.isArray(faqPage.mainEntity) ? faqPage.mainEntity.length : 0,
      0,
      `${pathname} FAQPage must contain question entities`,
    );
  }
  if (localBusiness) {
    expectSame(
      localBusiness["@id"],
      ids.localBusiness,
      `${pathname} LocalBusiness @id drifted`,
    );
    expectSame(
      localBusiness.url,
      `${SITE_ORIGIN}/`,
      `${pathname} LocalBusiness.url must match site root`,
    );
  }
}

function expectBreadcrumb(pathname: string, breadcrumb: any) {
  const items = Array.isArray(breadcrumb.itemListElement)
    ? breadcrumb.itemListElement
    : [];

  expectGreaterThan(
    items.length,
    1,
    `${pathname} BreadcrumbList must contain items`,
  );
  expectSame(
    items[0]?.position,
    1,
    `${pathname} breadcrumb must start at position 1`,
  );
  expectSame(
    items[0]?.item,
    `${SITE_ORIGIN}/`,
    `${pathname} breadcrumb must start at home`,
  );
  expectSame(
    items[items.length - 1]?.item,
    canonicalForPathname(pathname),
    `${pathname} breadcrumb last item must match canonical path`,
  );

  items.forEach((item: any, index: number) => {
    expectSame(
      item.position,
      index + 1,
      `${pathname} breadcrumb positions must be sequential`,
    );
    expectTruthy(
      item.name,
      `${pathname} breadcrumb item ${index + 1} is missing name`,
    );
    expectAbsoluteUrl(pathname, item.item, `breadcrumb item ${index + 1}`);
  });
}

function expectedSchemaIds(canonical: string) {
  const base = canonical.replace(/\/+$/, "");

  return {
    webPage: `${base}/#webpage`,
    collectionPage: `${base}/#collectionpage`,
    itemList: `${base}/#itemlist`,
    service: `${base}/#service`,
    blogPosting: `${base}/#blogposting`,
    contactPage: `${base}/#contactpage`,
    faqPage: `${base}/#faqpage`,
    localBusiness: `${base}/#localbusiness`,
  };
}

function expectUniqueSchemaIds(pathname: string, nodes: any[]) {
  const ids = nodes
    .map((node) => node["@id"])
    .filter((id): id is string => typeof id === "string");
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    throw new Error(
      `${pathname} has duplicate schema @id values: ${duplicateIds.join(", ")}`,
    );
  }
}

function expectSingletonSchemaTypes(pathname: string, nodes: any[]) {
  for (const type of [
    "WebSite",
    "Organization",
    "WebPage",
    "CollectionPage",
    "ItemList",
    "Service",
    "BlogPosting",
    "ContactPage",
    "FAQPage",
    "LocalBusiness",
  ]) {
    const matches = findNodesByType(nodes, type);
    if (matches.length === 0) continue;

    expectLength(
      matches,
      1,
      `${pathname} must emit exactly one ${type} schema`,
    );
  }
}

function isPathDisallowedByRobots(pathname: string) {
  const longestAllow = longestMatchingRule(robotsRules.allows, pathname);
  const longestDisallow = longestMatchingRule(robotsRules.disallows, pathname);

  return longestDisallow.length > longestAllow.length;
}

function expectRobotsDirective(pathname: string, robots: string | undefined) {
  const directives = (robots || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  expectArrayContains(
    directives,
    "index",
    `${pathname} robots must include index`,
  );
  expectArrayContains(
    directives,
    "follow",
    `${pathname} robots must include follow`,
  );
  for (const blocked of ["none", "noindex", "nofollow"]) {
    expectFalse(
      directives.includes(blocked),
      `${pathname} robots must not include ${blocked}`,
    );
  }
}

function expectAbsoluteUrl(
  pathname: string,
  value: string | undefined,
  label: string,
) {
  expectTruthy(value, `${pathname} is missing ${label}`);
  if (!value) return;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${pathname} ${label} must be absolute: ${value}`);
  }

  expectSame(parsed.protocol, "https:", `${pathname} ${label} must use https`);
}

function expectOptionalAbsoluteUrls(
  pathname: string,
  value: unknown,
  label: string,
) {
  const urls = Array.isArray(value) ? value : value ? [value] : [];

  urls.forEach((url, index) => {
    if (typeof url !== "string") {
      throw new Error(`${pathname} ${label} ${index + 1} must be a URL string`);
    }
    expectAbsoluteUrl(pathname, url, `${label} ${index + 1}`);
  });
}

function expectValidDate(value: unknown, message: string) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error(`${message}; received ${String(value)}`);
  }
}

function longestMatchingRule(rules: string[], pathname: string) {
  return (
    rules
      .filter((rule) => rule && pathname.startsWith(rule))
      .sort((a, b) => b.length - a.length)[0] || ""
  );
}

function expectTruthy(value: unknown, message: string) {
  if (!value) throw new Error(message);
}

function expectTrue(value: boolean, message: string) {
  if (!value) throw new Error(message);
}

function expectFalse(value: boolean, message: string) {
  if (value) throw new Error(message);
}

function expectLength(value: unknown[], length: number, message: string) {
  if (value.length !== length) {
    throw new Error(`${message}; received ${value.length}`);
  }
}

function expectGreaterThan(value: number, minimum: number, message: string) {
  if (value <= minimum) {
    throw new Error(`${message}; received ${value}`);
  }
}

function expectNotContains(
  value: string | undefined,
  expected: string,
  message: string,
) {
  if (value?.includes(expected)) {
    throw new Error(`${message}; received ${value}`);
  }
}

function expectArrayContains<T>(value: T[], expected: T, message: string) {
  if (!value.includes(expected)) {
    throw new Error(`${message}; received ${value.join(", ")}`);
  }
}

function expectSame(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) throw new Error(message);
}
