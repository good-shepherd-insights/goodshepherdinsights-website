export type SchemaIds = {
  baseUrl: string;
  canonical: string;
  website: string;
  organization: string;
  webPage: string;
  breadcrumb: string;
  collectionPage: string;
  itemList: string;
};

export const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const ensureTrailingSlash = (value: string) =>
  value.endsWith("/") ? value : `${value}/`;

export function absoluteSchemaUrl(value: string, base: string) {
  return new URL(value || "/", base).href;
}

export function schemaId(url: string, fragment: string) {
  return `${stripTrailingSlash(url)}/#${fragment}`;
}

export function buildSchemaIds(
  canonical: string,
  currentUrl: string,
): SchemaIds {
  const resolvedCanonical = absoluteSchemaUrl(canonical, currentUrl);
  const origin = new URL(resolvedCanonical).origin;
  const baseUrl = ensureTrailingSlash(origin);

  return {
    baseUrl,
    canonical: resolvedCanonical,
    website: `${stripTrailingSlash(baseUrl)}/#website`,
    organization: `${stripTrailingSlash(baseUrl)}/#organization`,
    webPage: schemaId(resolvedCanonical, "webpage"),
    breadcrumb: schemaId(resolvedCanonical, "breadcrumb"),
    collectionPage: schemaId(resolvedCanonical, "collectionpage"),
    itemList: schemaId(resolvedCanonical, "itemlist"),
  };
}

export function pathUrl(baseUrl: string, segments: string[]) {
  const cleanSegments = segments.map((segment) =>
    segment.replace(/^\/+|\/+$/g, ""),
  );
  return `${ensureTrailingSlash(baseUrl)}${cleanSegments.join("/")}${cleanSegments.length ? "/" : ""}`;
}
