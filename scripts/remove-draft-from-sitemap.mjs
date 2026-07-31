// scripts/process-sitemaps.mjs
import path from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseStringPromise, Builder } from "xml2js";
import { createClient } from "@sanity/client";

// --------- Cross-platform root ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");

// --------- Paths (absolute) ----------
const DIST_FOLDER = path.resolve(PROJECT_ROOT, "dist");
const LANG_FILE = path.resolve(PROJECT_ROOT, "src", "config", "language.json");
const ASTRO_CONFIG_FILE = path.resolve(
  PROJECT_ROOT,
  ".astro",
  "config.generated.json",
);

const SITEMAP_FILE_PATTERN = /^sitemap-\d+\.xml$/;

// --------- JSON load (Node-safe) ----------
async function readJsonFile(filePath) {
  try {
    const mod = await import(filePath);
    return mod.default ?? mod;
  } catch {
    try {
      const mod = await import(filePath);
      return mod.default ?? mod;
    } catch {
      const raw = await fs.readFile(filePath, "utf8");
      return JSON.parse(raw);
    }
  }
}

// --------- Helpers ----------
async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// Safe URL pathname extraction (handles absolute + relative)
function safePathname(loc) {
  if (!loc || typeof loc !== "string") return null;
  try {
    // If it's absolute
    return new URL(loc).pathname;
  } catch {
    // If it's relative, parse with dummy base
    try {
      return new URL(loc, "https://example.com").pathname;
    } catch {
      return null;
    }
  }
}

// Build every localized URL variant for a section/slug pair
function buildUrls(section, slug, settings) {
  const base = section ? `${section}/${slug}` : slug;
  return settings.languages.map((lang) => {
    const isDefault = lang.languageCode === settings.defaultLanguage;
    const urlPath =
      isDefault && !settings.showDefaultLangInUrl
        ? `/${base}`
        : `/${lang.languageCode}/${base}`;
    return urlPath.replace(/\/+/g, "/");
  });
}

// Query Sanity for documents flagged excludeFromSitemap, per content type
async function getExcludedUrls(settings) {
  const client = createClient({
    projectId: "8yy9mp89",
    dataset: "production",
    apiVersion: "2026-01-01",
    useCdn: true,
  });

  const sectionQueries = [
    { type: "blogPost", section: "blog", flagPath: "excludeFromSitemap" },
    { type: "caseStudy", section: "case-studies", flagPath: "seo.excludeFromSitemap" },
    { type: "service", section: "services", flagPath: "seo.excludeFromSitemap" },
    { type: "genericPage", section: "", flagPath: "seo.excludeFromSitemap" },
  ];

  const excludedUrlSet = new Set();

  for (const { type, section, flagPath } of sectionQueries) {
    const docs = await client.fetch(
      `*[_type == $type && ${flagPath} == true && defined(slug.current)]{"slug": slug.current}`,
      { type },
    );
    for (const doc of docs) {
      if (!doc?.slug) continue;
      for (const url of buildUrls(section, doc.slug, settings)) {
        excludedUrlSet.add(url);
      }
    }
  }

  return excludedUrlSet;
}

async function buildExcludedFolders() {
  const client = createClient({
    projectId: "8yy9mp89",
    dataset: "production",
    apiVersion: "2026-01-01",
    useCdn: true,
  });
  const fromCms =
    (await client.fetch(
      '*[_type == "indexing" && _id == "indexing"][0].sitemap.exclude',
    )) || [];
  return ["widgets", "sections", "author", ...(Array.isArray(fromCms) ? fromCms : [])];
}

async function getSitemapFiles() {
  const files = await fs.readdir(DIST_FOLDER);
  return files
    .filter((f) => SITEMAP_FILE_PATTERN.test(f))
    .map((f) => path.join(DIST_FOLDER, f));
}

// ---------------- Main ----------------
async function processSitemaps() {
  try {
    if (!(await pathExists(DIST_FOLDER))) {
      console.error(
        `❌ The 'dist' folder was not found at '${DIST_FOLDER}'.\n` +
          `   Run your build first (e.g., npm run build).`,
      );
      process.exitCode = 1;
      return;
    }

    const languagesJSON = await readJsonFile(LANG_FILE);
    const config = await readJsonFile(ASTRO_CONFIG_FILE);

    const settings = {
      ...(config?.settings?.multilingual ?? {}),
      languages: Array.isArray(languagesJSON) ? [...languagesJSON] : [],
    };

    const EXCLUDE_FOLDERS = await buildExcludedFolders();

    const sitemapFiles = await getSitemapFiles();
    const excludedUrlSet = await getExcludedUrls(settings);

    for (const sitemapFile of sitemapFiles) {
      const sitemapContent = await fs.readFile(sitemapFile, "utf8");

      const sitemapObj = await parseStringPromise(sitemapContent, {
        explicitArray: false,
        tagNameProcessors: [(name) => name.replace("xhtml:", "")],
      });

      const urlset = sitemapObj?.urlset;
      if (!urlset?.url) continue;

      const urls = Array.isArray(urlset.url) ? urlset.url : [urlset.url];

      const filtered = urls.filter((u) => {
        const pathname = safePathname(u?.loc);
        if (!pathname) return true; // if we can't parse it, don't delete it

        const segments = pathname.split("/").filter(Boolean);

        // Exclude specific folders (precise match for path segments)
        if (segments.some((segment) => EXCLUDE_FOLDERS.includes(segment))) {
          return false;
        }

        // Remove draft/excluded URLs
        // Match on either customSlug or generated url path
        for (const bad of excludedUrlSet) {
          if (bad && (pathname === bad || pathname === `${bad}/`)) {
            return false;
          }
        }

        return true;
      });

      sitemapObj.urlset.url = filtered;

      const updated = new Builder().buildObject(sitemapObj);
      const minified = updated
        .replace(/(>)(\s+)(<)/g, "$1$3")
        .replace(/\s+(?=<)/g, "");

      await fs.writeFile(sitemapFile, minified, "utf8");
    }

    console.log("✅ Sitemaps processed successfully.");

    // Copy sitemap-index.xml to sitemap.xml for better compatibility
    const indexFile = path.resolve(DIST_FOLDER, "sitemap-index.xml");
    const targetFile = path.resolve(DIST_FOLDER, "sitemap.xml");
    if (await pathExists(indexFile)) {
      await fs.copyFile(indexFile, targetFile);
      console.log("✅ Copied sitemap-index.xml to sitemap.xml");
    }
  } catch (error) {
    console.error("Error processing sitemaps:", error);
    process.exitCode = 1;
  }
}

processSitemaps();
