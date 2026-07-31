import type { APIRoute } from "astro";
import { getSiteGlobals } from "@/lib/sanity/siteGlobals";

const getRobotsTxt = (
  sitemapURL: URL,
  disallow: string[],
) => `# Robots.txt file for controlling web crawler access

User-agent: *

# Allowed pages
Allow: /

# Disallowed pages
${disallow?.map((item: string) => `Disallow: ${item}`).join("\n") || ""}

# Sitemap location
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = async ({ site }) => {
  const siteGlobals = await getSiteGlobals();
  if (!siteGlobals) {
    throw new Error('Missing required Sanity siteGlobals document with _id "site-globals"');
  }

  const { enable = true, disallow = [] } = siteGlobals.indexing?.robotsTxt || {};
  const sitemapURL = new URL("sitemap-index.xml", site);
  return enable
    ? new Response(getRobotsTxt(sitemapURL, disallow))
    : new Response(null, { status: 404 });
};
