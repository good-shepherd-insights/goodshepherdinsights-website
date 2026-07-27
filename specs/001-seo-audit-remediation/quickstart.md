# Quickstart: Validating SEO Audit Remediation

## Prerequisites

- Work happens against `origin/production` content (see research R1) — branch
  from/target that content, not `main`.
- `npm install` completed; Node >=22.12.
- For a full validation pass, `blc` (broken-link-checker) installed globally:
  `npm install -g broken-link-checker`.
- OpenSEO MCP connection available for re-running the site audit.

## Local validation loop

1. Start the dev server (also watches `config.toml`):
   ```sh
   npm run dev
   ```
2. Type-check and lint:
   ```sh
   npm run astro-check
   ```
   Expected: zero errors, zero warnings (Constitution Quality Gate).
3. Run the test suite (should include the new `SEO.astro` tagline-separator
   regression test from Constitution Principle IV):
   ```sh
   npm run test
   ```
   Expected: all tests pass, including the new title-building test.
4. Broken-link check against the local dev server:
   ```sh
   blc http://localhost:4321/ -ovre --filter-level 0 > broken-links.txt
   grep "├─BROKEN─" broken-links.txt
   ```
   Expected: no matches (spec SC-001).
5. Spot-check title/description output for the previously-affected pages —
   view source or use browser devtools on:
   - Homepage (`/`)
   - A previously-affected blog post (e.g.
     `/blog/chms-vendor-ai-questions-before-renewal/`)
   - All four blog pagination pages (`/blog/`, `/blog/page/2/`, `/page/3/`,
     `/page/4/`) — confirm titles/descriptions now differ per page
   - One tag page and one category page — confirm each has a distinct meta
     description
   Expected: no title over ~60 chars without a documented exception; no two
   pages share an identical title/description (spec SC-002/SC-003).
6. Spot-check heading structure on the previously-flagged pages (browser
   devtools → inspect headings, or an accessibility checker) — confirm exactly
   one H1 per page and no level skips (spec SC-004).

## Full-site validation (before calling the feature done)

1. Build and deploy (or use a preview deploy) so the live/staging URLs reflect
   the changes.
2. Re-run the OpenSEO site audit against the deployed URL.
3. Compare against the 2026-07-20 baseline audit:
   - `broken-internal-link`, `broken-page`: **0** (was 32 / 16)
   - `duplicate-title`, `duplicate-meta-description`: **0** (was 4 / 4)
   - `title-too-long`: **0** without documented exceptions (was 26)
   - `meta-description-too-short`, `meta-description-too-long`: **0** (was 10 / 1)
   - `multiple-h1`: **0** (was 1)
   - `heading-order-skip`: **0** (was 9)
   - `slow-response`: **0**, or each remaining occurrence has a documented
     investigation note (was 12)
   - `noindex-page` on the 6 taxonomy pages: present only if explicitly
     reconfirmed as intentional (spec FR-013) — otherwise 0
4. Run Unlighthouse (or equivalent) against the deployed site and confirm no
   page's Performance/Accessibility/Best Practices/SEO scores regressed below
   the thresholds in Constitution Principle II.
5. Manually click the "schedule a consultation" CTA from at least 3 of the 9
   posts that previously linked to the dead `/consultation` URL — confirm each
   lands on the real scheduling/contact page.
