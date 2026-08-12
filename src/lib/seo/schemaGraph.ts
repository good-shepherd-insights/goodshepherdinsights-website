import type { SiteGlobals } from "@/lib/sanity/siteGlobals";
import { buildSchemaIds } from "./ids";
import { buildItemListSchema, type ItemListEntry } from "./itemList";
import { buildOrganizationSchema, buildWebsiteSchema } from "./organization";
import { buildServiceSchema } from "./service";
import type { SchemaGraph, SchemaNode } from "./types";
import { schemaGraph } from "./types";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildContactPageSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from "./webpage";
import type { SanityService } from "@/lib/sanity/services";

type BaseGraphInput = {
  title?: string;
  description?: string;
  canonical: string;
  currentUrl: string;
  siteGlobals?: SiteGlobals;
  homeLabel: string;
  ignoredBreadcrumbSegments?: string[];
  inLanguage?: string;
  mainEntityId?: string;
};

export function buildBaseSchemaGraph(input: BaseGraphInput): SchemaGraph {
  const ids = buildSchemaIds(input.canonical, input.currentUrl);

  return schemaGraph([
    buildWebsiteSchema(input.siteGlobals, ids),
    buildOrganizationSchema(input.siteGlobals, ids),
    buildBreadcrumbSchema({
      ids,
      title: input.title,
      homeLabel: input.homeLabel,
      ignoredSegments: input.ignoredBreadcrumbSegments,
    }),
  ]);
}

export function buildStandardPageGraph(
  input: BaseGraphInput & {
    schemaType?:
      "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage";
  },
): SchemaGraph {
  const ids = buildSchemaIds(input.canonical, input.currentUrl);

  return schemaGraph([
    buildWebsiteSchema(input.siteGlobals, ids),
    buildOrganizationSchema(input.siteGlobals, ids),
    buildWebPageSchema({
      ids,
      name: input.title,
      description: input.description,
      type: input.schemaType,
      inLanguage: input.inLanguage,
      mainEntityId: input.mainEntityId,
    }),
    buildBreadcrumbSchema({
      ids,
      title: input.title,
      homeLabel: input.homeLabel,
      ignoredSegments: input.ignoredBreadcrumbSegments,
    }),
  ]);
}

export function buildCollectionGraph(
  input: BaseGraphInput & {
    items: ItemListEntry[];
    itemType?: "WebPage" | "Service" | "BlogPosting" | "Article";
  },
): SchemaGraph {
  const ids = buildSchemaIds(input.canonical, input.currentUrl);
  const itemList = buildItemListSchema({
    id: ids.itemList,
    items: input.items,
    itemType: input.itemType,
    baseUrl: ids.canonical,
  });

  return schemaGraph([
    buildWebsiteSchema(input.siteGlobals, ids),
    buildOrganizationSchema(input.siteGlobals, ids),
    buildCollectionPageSchema({
      ids,
      name: input.title,
      description: input.description,
      inLanguage: input.inLanguage,
    }),
    itemList,
    buildBreadcrumbSchema({
      ids,
      title: input.title,
      homeLabel: input.homeLabel,
      ignoredSegments: input.ignoredBreadcrumbSegments,
    }),
  ]);
}

export function buildFaqGraph(
  input: BaseGraphInput & {
    questions: Array<{ question?: string; answer?: string }>;
  },
): SchemaGraph {
  const ids = buildSchemaIds(input.canonical, input.currentUrl);

  return schemaGraph([
    buildWebsiteSchema(input.siteGlobals, ids),
    buildOrganizationSchema(input.siteGlobals, ids),
    buildFaqPageSchema({
      ids,
      name: input.title,
      description: input.description,
      inLanguage: input.inLanguage,
      questions: input.questions,
    }),
    buildBreadcrumbSchema({
      ids,
      title: input.title,
      homeLabel: input.homeLabel,
      ignoredSegments: input.ignoredBreadcrumbSegments,
    }),
  ]);
}

export function buildContactGraph(input: BaseGraphInput): SchemaGraph {
  const ids = buildSchemaIds(input.canonical, input.currentUrl);

  return schemaGraph([
    buildWebsiteSchema(input.siteGlobals, ids),
    buildOrganizationSchema(input.siteGlobals, ids),
    buildContactPageSchema({
      ids,
      name: input.title,
      description: input.description,
    }),
    buildBreadcrumbSchema({
      ids,
      title: input.title,
      homeLabel: input.homeLabel,
      ignoredSegments: input.ignoredBreadcrumbSegments,
    }),
  ]);
}

export function buildServicePageGraph(
  input: BaseGraphInput & {
    service: SanityService;
    image?: string;
    extraNodes?: SchemaNode[];
  },
): SchemaGraph {
  const ids = buildSchemaIds(input.canonical, input.currentUrl);

  return schemaGraph([
    buildWebsiteSchema(input.siteGlobals, ids),
    buildOrganizationSchema(input.siteGlobals, ids),
    buildWebPageSchema({
      ids,
      name: input.title,
      description: input.description,
      inLanguage: input.inLanguage,
    }),
    buildServiceSchema({
      service: input.service,
      ids,
      siteGlobals: input.siteGlobals,
      image: input.image,
    }),
    ...(input.extraNodes || []),
    buildBreadcrumbSchema({
      ids,
      title: input.title,
      homeLabel: input.homeLabel,
      ignoredSegments: input.ignoredBreadcrumbSegments,
    }),
  ]);
}
