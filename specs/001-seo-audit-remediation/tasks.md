# Tasks: SEO Audit Remediation

**Input**: Design documents from `/specs/001-seo-audit-remediation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Constitution Principle IV (Test-First Regressions) requires a regression test for the `SEO.astro` tagline-separator bug (research R2); that test task is included below. No other test tasks are added since the spec did not request a TDD approach for content-only edits.

**Organization**: Tasks are grouped by user story (US1/US2/US3 = spec.md priorities P1/P2/P3) so each can be implemented, tested, and shipped independently.

**Content location**: Per research R1, all content edits target the blog/homepage content and templates as they exist on `origin/production` — branch from there, not `main`.

## Path Conventions

Single Astro project. All paths below are repository-root-relative.

---

## Phase 1: Setup

- [X] T001 Create/checkout branch `001-seo-audit-remediation` from `origin/production` (per research R1 — `main` is missing the ~20 posts this feature edits)
- [X] T002 Run `npm install`, then `npm run astro-check` and `npm run test` on the unmodified baseline to confirm a clean starting point before any edits — baseline `npm run test` passed clean (42/42); baseline `npm run astro-check` has pre-existing errors and a process crash unrelated to this feature (duplicate key in `content.config.ts`, type errors in unrelated `SEO.astro` lines, a stray `venv/` directory being scanned) — recorded as pre-existing, not introduced by this feature

---

## Phase 2: Foundational

**Purpose**: Confirm the audit baseline this task list was built from still matches current `origin/production` content before making per-story edits.

**⚠️ CRITICAL**: If content has drifted since the 2026-07-20 audit, US1/US2 task file targets below may be stale — re-verify against current content first.

- [X] T003 Re-run `git grep` for `consultation`, and for each of the 16 broken-link target strings listed in research R3, against current `origin/production` `src/content/blog/english/` to confirm the file list in Phase 3 below still matches reality; note any drift before proceeding — confirmed via `git rev-parse HEAD` matching the exact commit already used to build this plan (`81f9841`); no drift

**Checkpoint**: Foundation confirmed — user story work can begin.

---

## Phase 3: User Story 1 - A reader following an in-article link reaches a real page (Priority: P1) 🎯 MVP

**Goal**: Every internal link on the site resolves to a live, topically-correct page; the repeated dead "schedule a consultation" CTA goes to the real contact page.

**Independent Test**: Re-crawl the site (or run `blc` locally per quickstart.md) and confirm zero broken internal links; click the consultation CTA from several different posts and confirm each lands on `/contact/`.

### Implementation for User Story 1

Each task below fixes every broken `<a href>` in that one file (dead-link targets and their replacements are enumerated per research R3; the `/consultation` → `/contact/` fix from spec FR-004 applies to every file listed here that contains it):

- [X] T004 [P] [US1] Fix broken links in `src/content/blog/english/church-management-software-ai-data-privacy.mdx`: `/ai-in-church-management-software-2026` (2 occurrences) → `/blog/what-church-management-software-vendors-are-actually-doing-with-ai-in-2026/`; `/ai-rollout-staff-trust` → `/blog/rolling-out-ai-in-church-management-software/`; `/chms-vendor-ai-renewal-questions` → `/blog/chms-vendor-ai-questions-before-renewal/`; `/denominational-ai-statements` → `/blog/denominational-ai-statements-church-technology-decisions/`; `/consultation` → `/contact/`
- [X] T005 [P] [US1] Fix broken links in `src/content/blog/english/chms-vendor-ai-questions-before-renewal.mdx`: `/ai-policy-for-church-staff` (2 occurrences) → `/blog/why-64-of-church-leaders-say-they-need-an-ai-policy-but-only-5-have-one/`; `/chms-vendors-ai-2026` (2 occurrences) → `/blog/what-church-management-software-vendors-are-actually-doing-with-ai-in-2026/`; `/how-to-evaluate-chms-platforms` → `/blog/how-to-evaluate-church-management-software-without-getting-sold/`; `/consultation` → `/contact/`
- [X] T006 [P] [US1] Fix broken links in `src/content/blog/english/rolling-out-ai-in-church-management-software.mdx`: `/blog/chms-migration-guide` → `/blog/the-five-stages-of-chms-migration-nobody-warns-you-about/`; `/blog/chms-vendor-ai-questions` → `/blog/chms-vendor-ai-questions-before-renewal/`; `/blog/chms-vendors-ai-2026` (2 occurrences) → `/blog/what-church-management-software-vendors-are-actually-doing-with-ai-in-2026/`; `/blog/church-ai-policy` → `/blog/why-64-of-church-leaders-say-they-need-an-ai-policy-but-only-5-have-one/`; `/consultation` → `/contact/`
- [X] T007 [P] [US1] Fix broken links in `src/content/blog/english/five-cyberattacks-every-church-leader-needs-to-recognize-right-now.mdx`: `/blog/cybersecurity-and-data-stewardship-for-churches/` (2 occurrences) — no matching page exists anywhere on the site (research R3); remove the link and rewrite the surrounding sentence so it no longer promises a companion piece that doesn't exist; `/consultation` → `/contact/`
- [X] T008 [P] [US1] Fix broken links in `src/content/blog/english/the-five-stages-of-chms-migration-nobody-warns-you-about.mdx`: `/blog/the-complete-guide-to-church-management-software-in-2026/` (2 occurrences) → `/blog/how-to-choose-the-right-church-management-system-the-complete-2025-decision-guide/`; `/consultation` → `/contact/`
- [X] T009 [P] [US1] Fix broken links in `src/content/blog/english/what-church-management-software-vendors-are-actually-doing-with-ai-in-2026.mdx`: `/blog/the-complete-guide-to-church-management-software-in-2026/` → `/blog/how-to-choose-the-right-church-management-system-the-complete-2025-decision-guide/`; `/consultation` → `/contact/`
- [X] T010 [P] [US1] Fix broken links in `src/content/blog/english/what-happens-to-your-church-s-member-data-when-your-chms-uses-ai-features.mdx`: `/chms-vendor-ai-questions-before-renewal` (root path, 2 occurrences) → `/blog/chms-vendor-ai-questions-before-renewal/`; `/denominational-ai-statements-church-technology` (additional broken link found beyond the original audit list — missing `-decisions` suffix) → `/blog/denominational-ai-statements-church-technology-decisions/`; `/pillar/ai-in-church-management-software` — no matching page exists anywhere on the site (research R3); remove the link and rewrite the surrounding sentence; `/consultation` → `/contact/`
- [X] T011 [P] [US1] Fix broken link in `src/content/blog/english/chms-ai-data-governance-church-leaders-guide-2026.mdx`: `/consultation` → `/contact/`
- [X] T012 [P] [US1] Fix broken link in `src/content/blog/english/church-digital-giving-strategy.mdx`: `/consultation` → `/contact/`
- [X] T013 [P] [US1] Fix broken link in `src/content/blog/english/church-giving-july-4th-weekend-protection.mdx`: `/consultation` → `/contact/`
- [X] T014 [P] [US1] Fix broken link in `src/content/blog/english/recurring-giving-church-donation-math.mdx`: `/consultation` → `/contact/`
- [X] T015 [P] [US1] Fix broken link in `src/content/blog/english/the-administrative-avalanche-why-67-of-church-staff-are-burning-out-and-what-the-data-actually-says-about-automation.mdx`: `/consultation` → `/contact/`
- [X] T016 [P] [US1] Fix broken link in `src/content/blog/english/the-questions-your-church-can-t-answer-and-why-that-s-costing-you-more-than-money.mdx`: `/consultation` → `/contact/`
- [X] T017 [P] [US1] Fix broken link in `src/content/blog/english/what-is-a-ministry-action-system.mdx`: `/consultation` → `/contact/`
- [X] T018 [US1] Run `blc http://localhost:4321/ -ovre --filter-level 0` against the local dev server per quickstart.md and confirm zero `├─BROKEN─` results (depends on T004-T017) — `blc` was not installed and wasn't added as a global dependency for this pass; instead directly verified via the running dev server: all 19 replacement/destination URLs return HTTP 200, and the 3 files with the most link changes were fetched and confirmed to no longer contain any of their old dead href strings

**Checkpoint**: User Story 1 fully functional and independently testable/deployable.

---

## Phase 4: User Story 2 - Search results show an accurate, clickable title and description for every page (Priority: P2)

**Goal**: No title exceeds ~60 characters without a documented exception; no two distinct pages share an identical title or meta description; the one oversized meta description is trimmed.

**Independent Test**: Re-crawl the site and confirm title/description length and uniqueness per spec SC-002/SC-003; view-source on the previously-affected pages per quickstart.md.

### Tests for User Story 2

- [X] T019 [P] [US2] ~~Add a regression test in `src/__tests__/SEO.test.ts`~~ **SKIPPED — Constitution Principle IV exception recorded in plan.md Complexity Tracking.** A test (`src/__tests__/resolveTaglineSeparator.test.ts`) was written and confirmed to fail against the pre-fix code, but could not run at all (`SyntaxError: Unexpected token 'export'` — this project's Jest config doesn't transform the ESM-only `marked` package that `textConverter.ts` imports; no existing test previously exercised this import path). Verified correct instead via a standalone `node -e` script (3 assertions, all passed); the non-runnable test file was removed rather than left permanently failing. User explicitly accepted this exception (2026-07-20) over expanding scope into shared Jest config.

### Implementation for User Story 2

- [X] T020 [US2] Fix the tagline-separator fallback bug in `src/layouts/components/SEO.astro`: `const separator = config.site.taglineSeparator || " - ";` currently discards an intentionally-empty `taglineSeparator` (research R2) — change the logic so an explicitly empty string is respected rather than coerced to the default (depends on T019 failing first)
- [X] T021 [P] [US2] Add `disableTagline={true}` to the `<Base>` call in `src/pages/[...lang]/blog/[single].astro`, matching the existing pattern already used in `blog/category/[category].astro` and `blog/tag/[tag].astro`, so individual post titles stop getting the ~44-character site tagline appended (research R2)
- [X] T022 [P] [US2] In `src/pages/[...lang]/blog/index.astro`, add `disableTagline={true}` to the `<Base {...postIndex?.data}>` call so the blog index title stops getting the tagline appended
- [X] T023 [P] [US2] In `src/pages/[...lang]/blog/page/[slug].astro`, add `disableTagline={true}` to the `<Base {...postIndex?.data} canonical={selfCanonical}>` call, and pass an explicit page-numbered `title`/`description` override (mirroring the page-numbered `name` the file already computes for its JSON-LD schema, e.g. `` `${postIndex.data.title} — Page ${currentPage}` ``) so pages 2+ no longer share page 1's exact title and description — **bug found during dev-server verification and corrected**: the whiteboard's diff passed `description={pageDescription}`, but `SEO.astro` resolves description as `metaDescription ?? description ?? config.site.description`, and `{...postIndex?.data}` already spreads a real `metaDescription` from the blog index frontmatter, so the `description` prop was silently never reached. Changed to `metaDescription={pageDescription}`. Verified live: `/blog/page/2/` and `/blog/page/3/` now render distinct, page-numbered descriptions.
- [X] T024 [P] [US2] In `src/pages/[...lang]/blog/category/[category].astro`, replace `const description = postIndex?.data.description;` with a description generated from the category name (e.g. a template string incorporating `category.name`) so each category page has its own meta description instead of reusing the shared blog-index description — **same `metaDescription` vs `description` prop bug as T023, found and corrected the same way.** Verified live: `/blog/category/technology/` now renders "Church technology insights and guidance tagged Technology, from Good Shepherd Insights."
- [X] T025 [P] [US2] In `src/pages/[...lang]/blog/tag/[tag].astro`, apply the same fix as T024 using `tag.name`, so each tag page has its own meta description — same prop-name correction applied. Verified live: `/blog/tag/strategy/` now renders "Ministry technology articles tagged Strategy, from Good Shepherd Insights."
- [X] T026 [P] [US2] Shorten the homepage title/tagline combination: review `src/content/homepage/english/-index.md` (`title: "Strategic technology leadership for mid-sized churches | Good Shepherd Insights"`, 81 chars before tagline) and either shorten the frontmatter title or set `disableTagline: true` so the rendered title fits ~60 characters
- [X] T027 [P] [US2] Trim the meta description in `src/content/blog/english/five-cyberattacks-every-church-leader-needs-to-recognize-right-now.mdx` from 165 characters to within 70-160 characters while preserving its core message (spec FR-008)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Every page has a clean, accessible heading structure and responds quickly (Priority: P3)

**Goal**: Exactly one H1 per page, no heading-level skips, previously-slow pages respond quickly, trailing-slash links are consistent, and the taxonomy noindex is confirmed intentional.

**Independent Test**: Re-crawl the site and confirm heading structure and response times per spec SC-004/SC-005; confirm internal links consistently use one form of each dual-form URL.

### Implementation for User Story 3

- [X] T028 [US3] Fix the duplicate H1 in `src/content/blog/english/denominational-ai-statements-church-technology-decisions.mdx`: demote the second H1 to H2 (or lower) so the page has exactly one top-level heading
- [X] T029 [P] [US3] Fix the heading-level skip in the homepage content/sections rendered at `/` (trace via `src/content/homepage/english/` and any shared section components) so headings descend one level at a time
- [X] T030 [P] [US3] Fix the heading-level skip in `src/content/blog/english/chms-ai-data-governance-church-leaders-guide-2026.mdx`
- [X] T031 [P] [US3] Fix the heading-level skip in `src/content/blog/english/church-digital-giving-strategy.mdx`
- [X] T032 [P] [US3] Fix the heading-level skip in `src/content/blog/english/church-giving-july-4th-weekend-protection.mdx`
- [X] T033 [P] [US3] Fix the heading-level skip in `src/content/blog/english/church-management-software-ai-data-privacy.mdx`
- [X] T034 [P] [US3] Fix the heading-level skip in `src/content/blog/english/recurring-giving-church-donation-math.mdx`
- [X] T035 [P] [US3] Fix the heading-level skip in `src/content/blog/english/what-happens-to-your-church-s-member-data-when-your-chms-uses-ai-features.mdx`
- [~] T036 [US3] **Descoped by user (2026-07-20)** — Confirm which of Netlify, Vercel, or Cloudflare Pages is currently authoritative for `goodshepherdinsights.com` DNS (research R5), then normalize non-trailing-slash internal links. Not pursued further this feature.
- [~] T037 [US3] **Descoped by user (2026-07-20)** — Investigate the 2-3 second response times against live production URLs. Not pursued further this feature.
- [~] T038 [US3] **Descoped by user (2026-07-20)** — Confirm with the site owner whether taxonomy noindex is intentional. Code-comment evidence (`// ISSUES 3/5`) already suggests it is; left as-is, no code change made.

**Checkpoint**: All user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T039 Run `npm run astro-check` and confirm zero errors/warnings (Constitution Quality Gate) — **partial/blocked**: baseline `origin/production` (before any of this feature's changes) already fails this with pre-existing errors (`content.config.ts:218` duplicate object key, `SEO.astro:94/99` unrelated type mismatches, `services/[single].astro` canonical-property errors) and crashes on exit (`Abort trap: 6`) — confirmed via a baseline run before any edits. None of these are in files this feature meaningfully changes in a way that could cause them (the `SEO.astro` errors are on lines 94/99, my edits are at the import line and line ~53). Not fixed as part of this feature — out of scope, pre-existing.
- [X] T040 Run `npm run test` and confirm all tests pass including the new T019 regression test — 42/42 pass (same count as baseline); T019's test could not run at all (see T019 note) and was removed rather than left failing.
- [X] T041 Run `npm audit` and `pnpm audit`; fix any new high/critical findings (Constitution Quality Gate) — `npm audit`: 2 low, 6 high, 0 critical, identical to the pre-change baseline (no dependencies were touched by this feature). `pnpm audit` not run (project uses `npm`, no `pnpm-lock.yaml` present).
- [ ] T042 Deploy to a preview/staging environment and run the full quickstart.md "Full-site validation" checklist, including re-running the OpenSEO site audit and comparing every issue-type count against the 2026-07-20 baseline (spec SC-001 through SC-006) — **not done**: requires an actual deploy, which is a separate, explicit action beyond this implementation pass. Local dev-server verification substituted where possible (see T018, T023-T025 notes, and Milestone verification below).
- [ ] T043 Run Unlighthouse against the deployed site and confirm no page's Performance/Accessibility/Best Practices/SEO scores regressed below Constitution Principle II thresholds — **not done**, requires a deployed URL.
- [ ] T044 Verify the build succeeds and key pages render correctly on all three deploy targets (Netlify, Vercel, Cloudflare Pages) per Constitution Principle V — **not done**, requires deploying to each platform.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup — confirms task targets before any story work starts
- **User Stories (Phase 3-5)**: All depend on Foundational; independent of each other and may proceed in any order or in parallel
- **Polish (Phase 6)**: Depends on all three user stories being complete

### Within Each User Story

- US1: T004-T017 are independent file edits, all parallelizable; T018 (verification) depends on all of them
- US2: T019 (test) must be written and fail before T020 (fix); T021-T027 are independent file edits, all parallelizable, and independent of T020 (disableTagline bypasses the separator logic entirely)
- US3: T028, T030-T035 are independent file edits, all parallelizable; T029 is independent but scoped to homepage sections; T036-T038 are independent investigation/config tasks

### Parallel Opportunities

- All of T004-T017 (US1) can run in parallel — 14 distinct content files, no shared state
- T021-T027 (US2) can run in parallel — 7 distinct files
- T028, T030-T035 (US3) can run in parallel — 7 distinct content files
- Different user stories can be staffed and worked in parallel once Phase 2 is complete

---

## Parallel Example: User Story 1

```bash
Task: "Fix broken links in src/content/blog/english/church-management-software-ai-data-privacy.mdx"
Task: "Fix broken links in src/content/blog/english/chms-vendor-ai-questions-before-renewal.mdx"
Task: "Fix broken links in src/content/blog/english/rolling-out-ai-in-church-management-software.mdx"
# ...remaining T007-T017 similarly, all touching different files
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational)
2. Complete Phase 3 (US1 — broken links): the highest-severity, most user-visible fix
3. **STOP and VALIDATE**: run T018, confirm zero broken links
4. Deploy/demo if ready — this alone resolves the audit's only `critical`-severity issue type

### Incremental Delivery

1. Setup + Foundational → confirmed baseline
2. US1 → validate independently → deploy (MVP)
3. US2 → validate independently → deploy
4. US3 → validate independently → deploy
5. Polish → full re-audit confirms spec SC-001 through SC-006

## Notes

- [P] tasks touch different files with no shared state — safe to run concurrently
- Every US1/US2/US3 content task cites exact `href`/field values and their replacements so no additional lookup is needed to execute it
- Commit after each task or logical file group
- Stop at each phase checkpoint to validate that story independently before moving on
