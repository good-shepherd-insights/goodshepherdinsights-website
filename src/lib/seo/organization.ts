import type { SiteGlobals } from "@/lib/sanity/siteGlobals";
import type { SchemaIds } from "./ids";
import { absoluteSchemaUrl } from "./ids";
import type { SchemaNode } from "./types";

function siteName(siteGlobals?: SiteGlobals) {
  const seoDefaults = siteGlobals?.seoDefaults;
  const title = siteGlobals?.brand?.title || seoDefaults?.title || "";
  if (!seoDefaults?.tagline) return title;

  return `${title}${seoDefaults.taglineSeparator || " - "}${seoDefaults.tagline}`;
}

export function buildWebsiteSchema(
  siteGlobals: SiteGlobals | undefined,
  ids: SchemaIds,
): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: siteName(siteGlobals),
    description: siteGlobals?.seoDefaults?.description,
    url: ids.baseUrl,
  };
}

export function buildOrganizationSchema(
  siteGlobals: SiteGlobals | undefined,
  ids: SchemaIds,
): SchemaNode {
  const organization = siteGlobals?.organization || {};
  const address = organization.address || {};
  const logo = organization.logo || siteGlobals?.brand?.logoPath;
  const email = organization.email || siteGlobals?.contact?.emailLabel;
  const telephone = organization.telephone || siteGlobals?.contact?.phoneLabel;

  return {
    "@type": "Organization",
    "@id": ids.organization,
    name:
      organization.name ||
      siteGlobals?.brand?.title ||
      siteGlobals?.seoDefaults?.author,
    url: ids.baseUrl,
    sameAs: (siteGlobals?.socialLinks || [])
      .filter((item) => item.enable !== false && item.url)
      .map((item) => item.url),
    logo: logo
      ? {
          "@type": "ImageObject",
          url: absoluteSchemaUrl(logo, ids.baseUrl),
        }
      : undefined,
    address:
      address.streetAddress || address.addressLocality || address.addressRegion
        ? {
            "@type": "PostalAddress",
            streetAddress: address.streetAddress,
            addressLocality: address.addressLocality,
            addressRegion: address.addressRegion,
          }
        : undefined,
    email,
    telephone,
  };
}
