import type { APIRoute } from "astro";
import { getSiteGlobals } from "@/lib/sanity/siteGlobals";
import { sanityImageUrl } from "@/lib/sanity/client";

export const GET: APIRoute = async () => {
  const siteGlobals = await getSiteGlobals();
  if (!siteGlobals) {
    throw new Error('Missing required Sanity siteGlobals document with _id "site-globals"');
  }

  const manifest = siteGlobals.appManifest;
  if (!manifest?.name || !manifest?.shortName) {
    throw new Error("Missing required Sanity app manifest name or shortName");
  }

  const icons = (manifest.icons ?? [])
    .map((icon) => {
      const asset = icon.image?.image?.asset;
      if (!asset) return null;
      const src = sanityImageUrl(asset).auto("format").url();
      return {
        ...(icon.sizes ? { sizes: icon.sizes } : {}),
        ...(icon.type ? { type: icon.type } : {}),
        ...(icon.purpose ? { purpose: icon.purpose } : {}),
        src,
      };
    })
    .filter((icon): icon is { sizes?: string; type?: string; purpose?: string; src: string } =>
      icon !== null,
    );

  return new Response(
    JSON.stringify(
      {
        name: manifest.name,
        short_name: manifest.shortName,
        icons,
        theme_color: manifest.themeColor || "#ffffff",
        background_color: manifest.backgroundColor || "#ffffff",
        display: manifest.display || "standalone",
      },
      null,
      2,
    ),
    {
      headers: {
        "content-type": "application/manifest+json; charset=utf-8",
      },
    },
  );
};
