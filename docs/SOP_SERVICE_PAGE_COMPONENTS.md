# SOP — Service Page Component Build & CMS Wiring

Repo: `/Users/dev/Projects/goodshepherdinsights-website` (Astro 5 + Tailwind v4 CSS-first + Sanity CMS).
Scope: building one service-page component per `KEY_SERVICE_PAGE_COMPONENTS.md` and wiring it into the CMS so editors control placement, content, and layout variant without code changes.

**This SOP is the process. Deviating from any numbered step is a failure regardless of how the result looks.**

> **Binding addendum:** This SOP is executed under `docs/SWORN_CAPABILITY_STATEMENT.md` (2026-09-16). Its Section III protocol (scope maps, literal phase compliance, Playwright verification, rendered-proof reporting, no fabricated explanations, no self-certification, plain failure statements) carries contractual weight across all phases below. Section IV of that document defines accountability for violations, including knowingly reported false results.

---

## Phase 0 — Scope lock (before any work)

1. Read the component's section in `KEY_SERVICE_PAGE_COMPONENTS.md`. List the exact content elements it must render. This list is the acceptance criteria for the QA gate in Phase 2.
2. Confirm with the user: placement on the page, and whether the component replaces an existing block or inserts alongside it.
3. Nothing outside the component + its CMS wiring may change: no PageHeader, no other sections, no schema changes beyond the new block, no unrelated files.
4. **Write the scope as an explicit removal map.** For this redesign (replace components, repurpose content), the user instruction "remove X, keep up to Y, comment out Z, leave what's under it" must be converted into a written list per page before touching anything: `REMOVE: [components]` / `KEEP: [components]` / `COMMENT OUT: [components]`. Read the map back to the user for confirmation when any element's position is ambiguous (e.g., "under the video" = after it, not including it).
5. **"After the video" ≠ "including the video's own blocks."** A section that exists to host a feature (e.g., `serviceImage` hosting the video) belongs to that feature. If the feature is removed/commented, its host block is removed/commented with it — it does not keep rendering orphaned. Conversely, shared site sections below it (feature grid, marquee, FAQ, CTA) are out of scope unless explicitly named.
6. **Scope is interpreted once, in writing.** If the written map conflicts with anything the user later says, stop and re-map. Never widen scope during execution to "also remove" sections not on the map — that is a Phase 0 failure even if the removals look justified.

## Phase 1 — Source research (before any design)

1. Inventory the committed design system: `src/layouts/components/` (sections, widgets, cards), `src/styles/*.css`, `Button.astro` API. Note the section mechanics relevant to this component.
2. Identify the **contrast context**: what background the preceding section ends on and what the following section starts on. The component must sit on the correct light/dark path (`bg-primary`/`bg-body-dark` = dark; `bg-light`/`bg-body`/`bg-secondary/30` = light). Never place a dark component after a dark hero.
3. Research enterprise patterns for this component type **with named, fetched evidence** — real sites, quoted headlines, per-site element findings. No generic marketing advice.
4. Note (do not yet draft) the verified content sources for this component: the HydraDB corpus (`hydradb` CLI, database `goodshepherdinsights-main`, collection `hydra-db-mcp`) mirrors `~/Downloads/good-shepherd-insights-formatted.md` and the `pillar-*.md` docs. Full copy drafting happens later, in Phase 3, after a variant is chosen — not here.

## Phase 2 — Build variants for QA (before any real content is drafted)

**Sequence guard:** structural build and QA happen before production content exists. Do not draft traced, production-depth copy in this phase — see Phase 3.

1. **Structure:** one content architecture, exactly **three structurally distinct variations**. Distinct means different DOM mechanics (grid split vs. numbered ledger vs. native styled list) — not the same markup in a tinted box. A restyle of variant 1 is not a variant.
2. **Styling — tracked precedent only.** Every Tailwind class must exist in git-tracked files (`git grep`; untracked files don't count as precedent). If a genuinely needed utility has no tracked precedent, do not invent it silently: propose it to the user and wait for explicit instruction (Hard rule 5). Banned list — utilities that previously failed review and must not be used in new components: `lg:items-baseline`, `border-l-2`, `bg-dark/90`, `underline-offset-4`, scoped `<style>`/`:global()`, `min-h-72`, `px-14`, `pt-14`, `lg:pt-20`, `sm:px-10`, `lg:py-16`, bare `space-y-5` (unprefixed; the `lg:space-y-5` prefix exists). Standard `max-md:*` variants with tracked usage (e.g. `max-md:text-base-sm`, `max-md:py-2`) are precedented like any other class — the rule is precedent, not the prefix.
3. **Generic component:** zero service-specific copy inside the component. All copy via the content props type.
4. **Reusable API:** `id`, `content` (typed), `variant` union, optional `headingLevel`, optional image/CTA. Empty optional fields must skip blocks gracefully (guards), not break the build.
5. **Images:** components that render imagery use the committed pattern — Sanity assets through `serviceImageUrl()` / `sanityImageUrl()` (`@sanity/image-url`; crop via `.fit("crop")` only when a height is set), local assets through `OptimizedImage`. `alt` is required on content images; decorative/ambient images get `alt=""` + `aria-hidden="true"`.
6. **Full-bleed awareness:** if the design needs an edge-to-edge background, the component must be rendered at section level, not inside a `container`/prose wrapper. (See Phase 4 wiring.)
7. **Root section must carry `pt-0!`.** The component's root `<section>` renders nested inside `<main>`, where global CSS (`main section { @apply section-spacing }` — `src/styles/base.css:13`) injects `pt-20 md:pt-32` (80–128px of dead space) above it. Every component ships with `pt-0!` on its root section element — ServiceHero, ServiceFitQualification, and ServiceEngagementProcess all carry it. Spacing belongs to the component's internal layout, never inherited from the global rule. (This failure occurred three times before becoming a rule.)
8. **Ticket evidence must render.** Screenshots attached to tracking tickets use the upload pipeline (`prepare_attachment_upload` → PUT → `create_attachment_from_upload`) and are embedded in comments via the returned hosted URL. `file://` paths never render — a comment posted with local paths is a broken artifact, not a done step. Before reporting "screenshots added," confirm the comment body contains hosted URLs and the images display.
7. **QA fixture copy:** write placeholder content sufficient to evaluate structure, spacing, and contrast — full sentences, no lorem ipsum, no TODOs, clearly stand-in (it is replaced with traced production copy in Phase 3 once a variant is chosen). This is not the traced-content bar; it exists only to make the variants legible to QA.
8. **Fixture page:** `src/pages/design/index.astro` carries only the component currently under review. **Always clear the page of any prior component's fixture before adding the new one** — never accumulate past components on it. Keep its `<Base>` `robots="noindex, nofollow"`, `hideOffcanvas`, and unwired-from-live-pages status. Section header contains only the component name, its goal, the required content elements, and the hard requirements. No mechanics narration, no "design review" slop.
9. All variants render with the same placeholder fixture content. Verify: build passes, one `<h1>`, `aria-labelledby` resolves per variant, no lorem/TODO, full-sentence content everywhere.

### Phase 2 QA gate (mandatory stop)

Do not proceed to Phase 3 until the user has reviewed the variants on `/design/` and picked (or approved) the component/variant(s) to carry forward. Record the decision. Widening back into "just also fix X" during this gate re-opens Phase 0 scope lock — it is not a free pass to touch other sections.

## Phase 3 — Content definition (after QA passes, before CMS wiring)

1. Write the content schema: the fields the component needs, with types (`string`, `string[]`, `{label, owns}[]`, …) and which are optional. This is now scoped to the variant(s) the QA gate approved.
2. Draft the fixture/production copy at production depth: full sentences, multi-paragraph where the source supports it. Thin one-liners are an immediate fail.
3. Every claim must be traceable. No invented metrics, percentages, dollar figures, guarantees, timeframes, or vendor names. If the source says "I", the fixture uses "we" (declared convention).
4. Show the user any composed line (e.g., role ownership sentences) with its per-line source trace before it ships.
5. Update the `/design/` fixture section to use this traced copy in place of the Phase 2 placeholder, so the page under review always reflects current real content.

## Phase 4 — CMS wiring

0. **Sequence guard:** Phase 4 begins only after the Phase 2 QA gate has passed and Phase 3 content is drafted and traced. Do not start schema, data-layer, or renderer work before both are done. Building out of sequence masks design or content problems behind plumbing and is a violation.
1. **Schema** (`studio/schemaTypes/serviceBlocks.ts`): one `defineType` block per component. Fields mirror Phase 3's content schema. Layout variant as a radio enum. No business copy in the schema. Register the block in the service document's `body` array (`studio/schemaTypes/service.ts`) and export it in `studio/schemaTypes/index.ts`. Validate: `cd studio && npx sanity schema validate` → 0 errors.
2. **Data layer** (`src/lib/sanity/services.ts`): extend the `SanityServiceBlock` union; add a mapping helper (e.g., `getServiceFitRender(block, service)`) that normalizes/trims fields, applies documented fallbacks, and resolves shared elements (CTA) from the **existing** block — e.g., the serviceCta block is the single CTA source; do not duplicate CTA fields onto new blocks. Return `null` (render nothing) when the block is empty or required shared blocks are missing — explicit failure, never silently partial.
3. **Renderer** (`src/layouts/components/widgets/SanityServiceContent.astro`): add one ternary branch per new block type in the existing `value.map` switch. Existing branches must stay byte-identical — read the full `git diff` of this file before proceeding. If the component needs a full-bleed background, render it at section level (outside the container/prose flow) with the prose-flow branch returning `null`.
4. **Import paths:** tsconfig maps `@/components/*` → `src/layouts/components/*`. Widgets in `src/components/` must be imported with **relative paths** (`../../../components/widgets/...`) or `astro check` fails. Run `npx astro check` and confirm zero new errors (baseline errors in `studio/` are pre-existing).
5. **Graceful degradation:** services without the block render nothing extra. Rebuild and verify every service page: correct ones show the component, others show zero regression.
6. Only after this phase does the component get added to live service pages.

## Phase 4b — Spacing, contrast & removal verification (mandatory, do not trust code inspection)

1. Rebuild, then verify with Playwright screenshots, not code reading. Setup (not currently in any package.json — install ad hoc):
   ```sh
   mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm install playwright-core
   ```
   Use the repo machine's cached Chromium: `~/Library/Caches/ms-playwright/chromium_headless_shell-<rev>/chrome-headless-shell-mac-arm64/chrome-headless-shell` (check the actual `<rev>`; today it is `1243`), passed to `chromium.launch({ executablePath })`.
   - Boundary screenshot: bottom of the previous section through the top of the new component.
   - **Assert no dead gap** (e.g., `fit.top - hero.bottom` ≈ 0, not 80–128px) — nested `<section>` inherits `main section { section-spacing }` (`src/styles/base.css:13`); cancel with `pt-0!` where needed.
   - **Assert the background fills the viewport width** — if the tint stops at the container with white gutters, the block must be hoisted to section level.
2. Verify computed styles in-page (`getComputedStyle`) when screenshots are ambiguous.
3. Built pages live at `dist/services/<slug>/index.html` (default language, unprefixed — `showDefaultLangInUrl = false`) and `dist/fr/services/<slug>/index.html` for prefixed locales. Check both if anything looks off.
4. **Removal verification — assert the removal map from Phase 0 is fully honored in the built HTML** (strip `<style>` blocks first; CSS class names are not evidence):
   - For every component on the REMOVE list: assert its DOM marker is absent (e.g., `sub-service-card`, `bg-border-dark`, video toggle). A class name in a stylesheet is not a violation; an element in the body is.
   - For every component on the KEEP list: assert its marker is present.
   - For every COMMENT OUT list item: assert the user-visible element is absent (e.g., a play button) AND the comment wrapper exists in source for restoration.
   - **Orphan check:** any block whose purpose was to host a removed/commented feature must itself be absent (e.g., a poster image whose video is commented out is orphaned — it goes).
   - **Page-content scan:** grep the built body for strings the user identified as removed; any hit means an incomplete removal.
   - **Trailing-empty-section check:** when content under a component is stripped, the host section's orphaned bottom spacing (`section-spacing-bottom` = `pb-20 md:pb-32`) is stripped with it — verify the boundary **after** the last content block, not just before. Assert `nextSection.top − lastContent.bottom` ≈ 0 with a screenshot on at least two pages.
5. **Dev-server hygiene:** if a long-running `astro dev` was started before code changes, restart it before verifying (hot-reload may or may not have applied; do not assume either way — verify against the fresh process). Kill only preview/screenshot servers you started yourself; never kill a user-started dev server without saying so.

## Phase 4c — CMS content population

1. All Sanity CLI commands run from `studio/` (the studio config lives there): fetch the service document with `cd studio && npx sanity documents get service-<slug>`, mutate locally (insert block at the correct body index, trim absorbed paragraphs from neighboring blocks), write back with `cd studio && npx sanity documents create <file> --replace`.
2. Verify live state via the public API query (`body[0...2]._type`, field counts).
3. For services without verified copy yet: insert a structured placeholder block with explicit "replace in the studio" labels so the wiring is connected and the editor has the structure. Never ship placeholder-looking text as final content on a page that was supposed to have real copy.
4. Verify all pages build; assert rendered output per page (present on populated pages, absent + zero regression on the rest).

## Phase 5 — Independent review gate

0. **Ticket evidence must render.** Screenshots attached to tracking tickets use the Linear upload pipeline (`prepare_attachment_upload` → PUT → `create_attachment_from_upload`) and are embedded in comments via the returned `uploads.linear.app` URL. `file://` paths never render — a comment posted with local paths is a broken artifact, not a done step. Before reporting "screenshots added," confirm the comment body contains hosted URLs and the images display.

1. Dispatch an independent subagent. The prompt must enumerate every requirement with instructions to quote `file:line` evidence, include the banned-utilities list, require strict diffs on shared files (`SanityServiceContent.astro` diffs must show only the permitted changes), and require checking rendered HTML, not just source.
2. On FAIL: fix exactly the deviations, re-run the build, and dispatch a **fresh** subagent (never the same one) until PASS.
3. Never self-certify. A subagent PASS is the only "done".

## Phase 6 — Handoff state

- Report: what shipped, per-page behavior (populated vs. graceful-absent), the editor workflow in the studio, and any open content debt (services still on placeholders).
- Leave scope exactly as approved: `git status --porcelain` should contain only the approved modified/untracked paths.

---

## Hard rules (every phase)

1. **No invented content.** Every claim traces to a verified source, recorded next to the copy.
2. **No non-precedent styling.** `git grep` in tracked files only; novel classes require explicit user approval before use.
3. **No wrapper variants.** A variation is a different DOM structure with a stated reason.
4. **No thin content.** Full sentences, production depth (Phase 3), or explicit user-approved placeholders (Phase 2 QA fixture).
5. **No unpermitted actions.** Research → propose → explicit instruction → execute.
6. **Visual verification via screenshots**, not code reading, for anything spacing/contrast related.
7. **If it fails, revert and say "I cannot complete this"** — never ship a sloppy pass.
8. **Execution honors the written scope map exactly.** Ambiguous instructions get converted to a written remove/keep/comment-out map and confirmed before work starts — never widened mid-execution. Scope overreach is a failure even when the extra removals look justified.
9. **Content follows structure, not the reverse.** Variants get built and QA'd on placeholder copy first; production-traced content is drafted only after a variant is chosen (Phase 2 QA gate → Phase 3). Do not draft traced content before that gate passes.
