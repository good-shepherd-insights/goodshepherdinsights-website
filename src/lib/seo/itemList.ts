import type { SchemaNode } from "./types";

export type ItemListEntry = {
  name: string;
  url: string;
  description?: string;
  image?: string;
};

export function buildItemListSchema({
  id,
  items,
  itemType = "WebPage",
  baseUrl,
}: {
  id: string;
  items: ItemListEntry[];
  itemType?: "WebPage" | "Service" | "BlogPosting" | "Article";
  baseUrl?: string;
}): SchemaNode | undefined {
  const itemListElement = items
    .filter((item) => item.name && item.url)
    .map((item, index) => {
      const url = baseUrl ? new URL(item.url, baseUrl).href : item.url;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": itemType,
          "@id": `${url.replace(/\/+$/, "")}/#${itemType.toLowerCase()}`,
          name: item.name,
          url,
          description: item.description,
          image: item.image,
        },
      };
    });

  if (itemListElement.length === 0) return undefined;

  return {
    "@type": "ItemList",
    "@id": id,
    itemListElement,
  };
}
