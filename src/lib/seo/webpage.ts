import type { SchemaIds } from "./ids";
import { pathUrl } from "./ids";
import type { SchemaNode } from "./types";

export type BreadcrumbOptions = {
  ids: SchemaIds;
  title?: string;
  homeLabel: string;
  ignoredSegments?: string[];
};

export function buildBreadcrumbSchema({
  ids,
  title,
  homeLabel,
  ignoredSegments = [],
}: BreadcrumbOptions): SchemaNode | undefined {
  const ignored = new Set(ignoredSegments.filter(Boolean));
  const segments = new URL(ids.canonical).pathname
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean)
    .filter((segment) => !ignored.has(segment));

  if (segments.length === 0) return undefined;

  return {
    "@type": "BreadcrumbList",
    "@id": ids.breadcrumb,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: ids.baseUrl,
      },
      ...segments.map((segment, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name:
          index === segments.length - 1
            ? title
            : segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " "),
        item: pathUrl(ids.baseUrl, segments.slice(0, index + 1)),
      })),
    ],
  };
}

export function buildWebPageSchema({
  ids,
  name,
  description,
  type = "WebPage",
  inLanguage,
  mainEntityId,
}: {
  ids: SchemaIds;
  name?: string;
  description?: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage";
  inLanguage?: string;
  mainEntityId?: string;
}): SchemaNode {
  return {
    "@type": type,
    "@id": ids.webPage,
    name,
    description,
    url: ids.canonical,
    isPartOf: { "@id": ids.website },
    mainEntity: mainEntityId ? { "@id": mainEntityId } : undefined,
    inLanguage,
  };
}

export function buildCollectionPageSchema({
  ids,
  name,
  description,
  itemListId = ids.itemList,
  inLanguage,
}: {
  ids: SchemaIds;
  name?: string;
  description?: string;
  itemListId?: string;
  inLanguage?: string;
}): SchemaNode {
  return {
    ...buildWebPageSchema({
      ids,
      name,
      description,
      type: "CollectionPage",
      inLanguage,
    }),
    "@id": ids.collectionPage,
    mainEntity: { "@id": itemListId },
  };
}

export function buildContactPageSchema({
  ids,
  name,
  description,
}: {
  ids: SchemaIds;
  name?: string;
  description?: string;
}): SchemaNode {
  return {
    ...buildWebPageSchema({ ids, name, description, type: "ContactPage" }),
    mainEntity: { "@id": ids.organization },
  };
}

export function buildFaqPageSchema({
  ids,
  name,
  description,
  inLanguage,
  questions,
}: {
  ids: SchemaIds;
  name?: string;
  description?: string;
  inLanguage?: string;
  questions: Array<{ question?: string; answer?: string }>;
}): SchemaNode {
  const mainEntity = questions
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  return {
    ...buildWebPageSchema({
      ids,
      name,
      description,
      type: "FAQPage",
      inLanguage,
    }),
    mainEntity: mainEntity.length > 0 ? mainEntity : undefined,
  };
}
