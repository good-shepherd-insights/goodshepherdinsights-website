import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

export type BuiltPage = {
  filePath: string;
  pathname: string;
  html: string;
};

export function readBuiltPages(distDir = "dist"): BuiltPage[] {
  return walk(distDir)
    .filter((filePath) => filePath.endsWith(".html"))
    .map((filePath) => ({
      filePath,
      pathname: pathnameFromHtmlFile(distDir, filePath),
      html: readFileSync(filePath, "utf8"),
    }))
    .sort((a, b) => a.pathname.localeCompare(b.pathname));
}

export function readSitemapUrls(distDir = "dist"): Set<string> {
  return new Set(readSitemapEntries(distDir));
}

export function readSitemapFilePaths(distDir = "dist"): string[] {
  return walk(distDir)
    .filter((filePath) => /^sitemap(?:-|\.|$)/.test(path.basename(filePath)))
    .sort();
}

export function readSitemapXmlReferences(distDir = "dist"): string[] {
  return readSitemapLocs(distDir).xmlReferences;
}

export function readSitemapEntries(distDir = "dist"): string[] {
  return readSitemapLocs(distDir).pageUrls;
}

export function sitemapUrlToDistPath(sitemapUrl: string, distDir = "dist") {
  const pathname = new URL(sitemapUrl).pathname.replace(/^\/+/, "");
  return path.join(distDir, pathname);
}

function readSitemapLocs(distDir: string) {
  const pageUrls: string[] = [];
  const xmlReferences: string[] = [];
  const sitemapFiles = readSitemapFilePaths(distDir);

  for (const filePath of sitemapFiles) {
    const xml = readFileSync(filePath, "utf8");
    const $ = cheerio.load(xml, { xmlMode: true });

    $("loc").each((_, loc) => {
      const value = $(loc).text().trim();
      if (value.endsWith(".xml")) {
        xmlReferences.push(value);
        return;
      }
      pageUrls.push(value);
    });
  }

  return { pageUrls, xmlReferences };
}

export function readRobotsTxt(distDir = "dist") {
  return readFileSync(path.join(distDir, "robots.txt"), "utf8");
}

export function parseRobotsTxt(robotsTxt: string) {
  const rules = {
    allows: [] as string[],
    disallows: [] as string[],
    sitemaps: [] as string[],
    userAgents: [] as string[],
  };

  for (const line of robotsTxt.split(/\r?\n/)) {
    const trimmed = line.replace(/#.*/, "").trim();
    if (!trimmed) continue;

    const [rawKey, ...rawValue] = trimmed.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rawValue.join(":").trim();
    if (!key || !value) continue;

    if (key === "allow") rules.allows.push(value);
    if (key === "disallow") rules.disallows.push(value);
    if (key === "sitemap") rules.sitemaps.push(value);
    if (key === "user-agent") rules.userAgents.push(value);
  }

  return rules;
}

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(filePath) : [filePath];
  });
}

function pathnameFromHtmlFile(distDir: string, filePath: string) {
  const relative = path.relative(distDir, filePath).replace(/\\/g, "/");

  if (relative === "index.html") return "/";
  if (relative === "404.html") return "/404";
  if (relative.endsWith("/index.html")) {
    return `/${relative.replace(/\/index\.html$/, "/")}`;
  }

  return `/${relative.replace(/\.html$/, "")}`;
}
