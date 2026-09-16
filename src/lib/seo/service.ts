import type { SanityService } from "@/lib/sanity/services";
import type { SiteGlobals } from "@/lib/sanity/siteGlobals";
import type { SchemaIds } from "./ids";
import type { SchemaNode } from "./types";

export function buildServiceSchema({
  service,
  ids,
  siteGlobals,
  image,
}: {
  service: SanityService;
  ids: SchemaIds;
  siteGlobals?: SiteGlobals;
  image?: string;
}): SchemaNode {
  const configuredAreas = service.schema?.areaServed
    ?.filter((area) => area.name)
    .map((area) => ({
      "@type": area.type || "Place",
      name: area.name,
    }));
  const fallbackRegion = siteGlobals?.organization?.address?.addressRegion;
  const offers = service.schema?.offers
    ?.filter((offer) => offer.name || offer.description || offer.url)
    .map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      url: offer.url,
    }));

  return {
    "@type": "Service",
    "@id": `${ids.canonical.replace(/\/+$/, "")}/#service`,
    name: service.title,
    description: service.seo?.metaDescription || service.excerpt,
    url: ids.canonical,
    image,
    mainEntityOfPage: { "@id": ids.webPage },
    provider: { "@id": ids.organization },
    serviceType: service.serviceType,
    areaServed:
      configuredAreas && configuredAreas.length > 0
        ? configuredAreas
        : fallbackRegion
          ? { "@type": "State", name: fallbackRegion }
          : undefined,
    audience: service.schema?.audience
      ?.filter((audience) => audience.name)
      .map((audience) => ({
        "@type": "Audience",
        name: audience.name,
      })),
    serviceOutput: service.schema?.serviceOutput,
    offers,
  };
}
