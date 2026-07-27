# Research: SEO Audit Remediation

## R1: Where the live content actually lives

**Decision**: All remediation work targets content and templates as they exist on
`origin/production`, not `main` or the branch this work started from.

**Rationale**: The OpenSEO audit crawled `https://goodshepherdinsights.com` and found
~20 blog posts and several standalone pages that do not exist in `main`/local
branches at all (e.g. `chms-vendor-ai-questions-before-renewal.mdx`,
`church-management-software-ai-data-privacy.mdx`). `git ls-tree` against
`origin/production` confirms all of them exist there. Package manifests are
identical between `main` and `production` (no dependency/version drift), so the
only divergence that matters for this feature is content, not tooling.

**Alternatives considered**: Assuming `main` was the deploy source and treating the
missing posts as "content to be written" — rejected, since that would mean
re-authoring ~20 already-published, indexed posts from scratch, which is not what
the audit findings describe (it found issues *within* those posts, meaning they
already render live).

## R2: Root cause of the oversized/duplicate titles

**Decision**: Title bloat is a template-configuration issue, not a copywriting
issue on most pages.

**Rationale**: `src/layouts/components/SEO.astro` builds the `<title>` as:
```
if (!disableTagline && config.site.tagline) {
  const separator = config.site.taglineSeparator || " - ";
  resolvedTitle += separator + config.site.tagline;
}
```
`config.site.taglineSeparator` is set to `""` in `config.toml` (evidently intending
"append the tagline with no separator" or "disable the extra separator"), but
`"" || " - "` evaluates to `" - "` in JS — the empty-string config value is
silently discarded and the fallback always applies. Independent of that bug, the
tagline itself ("Fractional CTO leadership for mid-sized churches", 44 chars) is
long enough that appending it to any already-complete page title reliably pushes
the total past the ~60-character guideline — the separator is a minor
contributor, not the main one.

`disableTagline` is already a first-class, schema-supported frontmatter field
(`disableTagline: z.boolean().optional()` in `content.config.ts`) and is already
used to suppress the tagline on `blog/category/[category].astro`,
`blog/tag/[tag].astro`, and `404.astro`. It is **not** currently set on
`blog/[single].astro`, `blog/index.astro`, or `blog/page/[slug].astro` — which is
exactly the set of pages the audit flags as oversized/duplicated.

The pagination duplicate-title/duplicate-description issue has a separate,
narrower cause: `index.astro` and `page/[slug].astro` both spread the *same*
`postIndex.data` frontmatter into `<Base>` for every pagination page. `page/[slug].astro`
already computes a page-numbered `name` for its JSON-LD block
(`` `${postIndex.data.title} - Page ${currentPage}` ``) but never applies that same
page-numbered distinction to the actual `<title>`/meta description the audit is
reading.

**Alternatives considered**: Rewriting every individual post's `metaTitle` to
manually account for the appended tagline — rejected as a page-by-page workaround
for what is a systemic template gap, and it would need to be redone by hand for
every future post.

## R3: Broken-link target mapping

**Decision**: Each broken link is mapped to an existing production page based on
matching its anchor text to that page's actual, published topic (verified by
reading anchor text in context via `git grep`), not guessed from the slug alone.

**Rationale**: Anchor-text inspection against `origin/production` content
resolved 13 of 16 dead-link destinations to specific existing posts with high
confidence (e.g. anchor "what to ask your ChMS vendor about AI before you renew"
→ the real, live `chms-vendor-ai-questions-before-renewal.mdx`). Two destinations
— a "cybersecurity and data stewardship" companion piece and an
"AI in church management software" pillar/hub page — have no corresponding
content anywhere in `origin/production`; these are treated as scope-excluded
(remove/rewrite the link, per spec FR-003) rather than as new-content tasks.

**Alternatives considered**: Building a redirect map (301s) from every dead slug
to its replacement instead of editing the source links — rejected as the wrong
tool here: these are authoring mistakes in the *linking* post's own body content
(hardcoded `<a href>` values inside MDX), not renamed pages that outside sites
still link to, so editing the source link is more direct and avoids growing a
permanent redirect table for typos.

## R4: Slow-response pages

**Decision**: Treat the 12 slow-response (2-3s) pages as requiring first-hand
timing investigation against the live production URLs during implementation,
rather than prescribing a specific fix now.

**Rationale**: `astro.config.mjs` sets no `output`/`adapter` override, so the site
builds as fully static HTML with no server-side compute at request time. A 2-3
second response time on a static host is not explained by anything visible in the
codebase — plausible causes include a cold CDN edge-cache miss on
infrequently-requested long-form posts, connection/TLS overhead on the crawler's
first hit, or a platform-specific redirect/config difference between the three
deploy targets (Netlify/Vercel/Cloudflare Pages) — but none of these can be
confirmed by reading source alone.

**Alternatives considered**: Assuming it's a build/prerendering problem and
pre-emptively changing caching headers or prerender config — rejected without
first reproducing the slowness against the live URLs, since guessing at infra
behavior risks a change that doesn't address the real cause (and this repo
deploys to three platforms whose caching layers are configured independently in
`netlify.toml`/`vercel.json`/`wrangler.toml`).

## R5: Trailing-slash duplicates

**Decision**: Confirm, during implementation, which of the three deploy targets
is authoritative for `goodshepherdinsights.com`, then normalize internal links to
the trailing-slash form consistently (matching `config.site.trailingSlash = true`
and Astro's `trailingSlash: "always"` build setting).

**Rationale**: `config.toml` and `astro.config.mjs` both already express an intent
that the trailing-slash form is canonical, and the audit confirms canonical tags
already correctly point non-slash URLs at their slash equivalents — so this is a
matter of finding and correcting the specific internal links/content that
reference the non-slash form, not a routing or canonical-tag defect. `vercel.json`
sets `"trailingSlash": true` explicitly (platform-level enforcement); the
equivalent Netlify/Cloudflare behavior was not fully confirmed from config alone
and should be spot-checked against whichever platform actually serves the domain.

## R6: Noindex on taxonomy pages

**Decision**: Treat as a plan/tasks-phase confirmation step with the project
stakeholder, not a code investigation — this is an editorial judgment call
(should tag/category listings be indexed?), not something resolvable from the
codebase.

**Rationale**: `disableTagline`-style per-template flags exist for many concerns,
but "should this page type be indexed" is a content-strategy decision. The
current `noindex, follow` on all six tag/category pages was applied uniformly and
deliberately (it is not a schema default — `robots` is an optional per-page
frontmatter/prop field), which is a point in favor of it being intentional, but a
sitewide crawl of source alone cannot confirm *why* it was chosen.
