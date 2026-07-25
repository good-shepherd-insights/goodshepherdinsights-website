# Implementation Plan: SEO Audit Remediation

**Branch**: `001-seo-audit-remediation` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-seo-audit-remediation/spec.md`

## Summary

Fix every issue the 2026-07-20 OpenSEO audit found across the live site
(`goodshepherdinsights.com`, served from `origin/production`): repoint or remove
32 broken internal links (13 have a clear existing replacement, 2 point to
content that doesn't exist and get their link removed instead, per research
R3); stop a site-wide title/tagline template bug from pushing 26 page titles
past ~60 characters and give paginated/taxonomy pages distinct titles and
descriptions (research R2); and clean up the smaller structural issues
(duplicate H1, heading-level skips, slow-response pages, trailing-slash link
consistency, and confirming the taxonomy noindex is intentional). No new
dependencies, no schema changes — `disableTagline` and `robots` are already
first-class frontmatter/prop fields; this is a targeted content + template fix.

## Technical Context

**Language/Version**: TypeScript 5.9 / Astro 6.1 (Node >=22.12)

**Primary Dependencies**: Astro (`astro`, `@astrojs/mdx`, `@astrojs/sitemap`),
Tailwind CSS 4, content authored as Markdown/MDX via Astro content collections
(`content.config.ts`), TOML site config (`src/config/config.toml`) hot-reloaded
via `scripts/toml-watcher.mjs`

**Storage**: N/A — content lives as MDX/Markdown files and TOML/JSON config in
the repo; no database

**Testing**: Jest (`npm run test`, config in `jest.config.ts` /
`tsconfig.jest.json`), plus the project's existing pre-launch checklist tools:
`npm run astro-check`, `broken-link-checker` (`blc`), Unlighthouse

**Target Platform**: Static site (`astro.config.mjs` sets no `output`/`adapter`
override → fully static HTML build), deployed to all three of Netlify, Vercel,
and Cloudflare Pages (`netlify.toml`, `vercel.json`, `wrangler.toml`)

**Project Type**: Content-driven marketing/blog website (single Astro project,
no separate frontend/backend split)

**Performance Goals**: Match existing project standard — Lighthouse
Performance 100 (home) / 95+ (other pages) on desktop and mobile per
Constitution Principle II; slow-response pages (currently 2-3s) brought to
"typical for the rest of the site" (Constitution Principle II / spec SC-005)

**Constraints**: Every internal link must resolve 2xx/3xx (Constitution
Principle I); no hardcoded copy/URLs in templates (Constitution Principle III);
must build and behave identically across all three deploy targets
(Constitution Principle V); every `config.toml` option must do what it says
(Constitution Principle VI — directly relevant, since the `taglineSeparator`
bug found in research R2 is exactly a violation of this principle)

**Scale/Scope**: ~50 crawled pages (per the audit), of which ~34 need at least
one fix; no new pages, routes, or content types are introduced

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Zero Broken Links | Feature's entire first user story exists to bring broken-link count to zero (spec SC-001) | PASS — directly enforces this principle |
| II. Lighthouse Performance Standards | Slow-response fix must not be applied in a way that regresses Lighthouse scores; must verify post-fix scores stay at threshold | PASS (verify at implementation time via Unlighthouse per `development-checklist.md`) |
| III. Content Lives in Data, Not Templates | Fix uses existing frontmatter fields (`disableTagline`, `metaTitle`, `metaDescription`, `robots`) and template-level defaults already used elsewhere (category/tag pages) — no new hardcoded copy/URLs introduced | PASS |
| IV. Test-First Regressions | The `taglineSeparator` fallback bug (research R2) is a genuine code defect and needs a regression test before the fix lands | PASS, tracked as a task — Jest test for `SEO.astro` title-building behavior with an empty `taglineSeparator` |
| V. Multi-Platform Deploy Parity | No platform-specific code path is introduced; trailing-slash normalization (R5) must be verified against whichever platform is actually authoritative for the live domain | PASS, with a task to confirm authoritative platform before finalizing R5 |
| VI. Config-Driven Behavior | `config.site.taglineSeparator = ""` currently does nothing (silently overridden) — this is the exact defect this principle exists to catch; fixing it satisfies this principle | PASS — this feature resolves an existing violation, it doesn't introduce one |

No violations requiring justification. Complexity Tracking table intentionally
left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-seo-audit-remediation/
├── plan.md              # This file
├── research.md           # Phase 0 output
├── data-model.md          # Phase 1 output
├── quickstart.md          # Phase 1 output
└── tasks.md               # Phase 2 output (/speckit-tasks — not yet created)
```

No `contracts/` directory: this feature has no external API, CLI, or
service-to-service interface — it edits static content and rendering templates
consumed only by the site's own build. (Per plan-template guidance: skip
contracts for projects with no external interface.)

### Source Code (repository root)

```text
src/
├── content/
│   ├── blog/english/*.mdx        # Post bodies — broken <a href> links live here (R3);
│   │                              #   per-post disableTagline/metaTitle/metaDescription overrides live here too
│   └── homepage/english/-index.md # Homepage title/metaDescription frontmatter
├── config/
│   └── config.toml                # site.tagline / site.taglineSeparator (R2)
├── layouts/
│   ├── components/SEO.astro       # Title-building logic incl. the taglineSeparator fallback bug (R2)
│   └── Base.astro                 # Passes disableTagline through to SEO.astro
├── pages/[...lang]/blog/
│   ├── [single].astro             # Individual post page — needs disableTagline treatment (R2)
│   ├── index.astro                # Blog listing page 1 — duplicate title/description source (R2)
│   ├── page/[slug].astro          # Blog listing pages 2+ — same duplicate title/description source (R2)
│   ├── category/[category].astro  # Already sets disableTagline + robots="noindex, follow" (reference pattern)
│   └── tag/[tag].astro            # Already sets disableTagline + robots="noindex, follow" (reference pattern)

src/__tests__/                     # Jest tests — add regression coverage for the SEO.astro title bug (Constitution IV)
```

**Structure Decision**: All changes are confined to existing directories —
content fixes in `src/content/blog/english/*.mdx` and
`src/content/homepage/english/-index.md`, template fixes in
`src/layouts/components/SEO.astro` and the three `src/pages/[...lang]/blog/*`
route files, and one config-consistency fix in `src/config/config.toml`. No new
top-level directories or project structure changes are needed.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| Principle IV (Test-First Regressions) exception for the `resolveTaglineSeparator` fix | Discovered during implementation: `src/__tests__/resolveTaglineSeparator.test.ts` (importing `src/lib/utils/textConverter.ts`, which imports the pure-ESM `marked` package) fails with `SyntaxError: Unexpected token 'export'` — this project's Jest config (`createDefaultEsmPreset` in `jest.config.ts`) only transforms `.ts`/`.tsx`/`.mts` files and never transforms `node_modules`, so `marked`'s ESM syntax reaches Jest's loader untransformed. No existing test in this repo previously imported anything that pulls in `marked`, so this gap was latent until this feature's test exposed it. The fix itself (`resolveTaglineSeparator`) was manually verified correct via a standalone `node -e` script (3 assertions: empty-string preserved, undefined falls back to `" - "`, custom separator passes through — all passed) before the non-runnable Jest test was removed. | Tried `NODE_OPTIONS=--experimental-vm-modules` (the standard fix for this class of problem) — it broke the *other*, previously-passing test (`getLocalUrlCTM.test.ts`) with `ReferenceError: exports is not defined`, proving this project's Jest setup is specifically tuned to run without that flag. A proper fix (e.g., adding a `.js`-file transform for `marked` specifically via babel-jest) would mean editing shared `jest.config.ts` in a way that risks affecting every other test in the suite — a change never reviewed in the whiteboard plan, and out of proportion to a one-line bug fix. User explicitly chose (2026-07-20) to accept this exception rather than expand scope into shared test infrastructure. |
