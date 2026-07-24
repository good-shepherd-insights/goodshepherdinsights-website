# Feature Specification: SEO Audit Remediation

**Feature Branch**: `001-seo-audit-remediation`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "SEO audit remediation: fix all issues found in the 2026-07-20 OpenSEO site audit of goodshepherdinsights.com (50 pages crawled)." Full scope covers three groups of findings: (1) broken internal links / dead pages, (2) title and meta-description template issues, (3) per-page structural/technical issues (multiple H1, heading-level skips, slow response, trailing-slash duplicates, noindex confirmation). Full issue-by-issue detail is preserved in the audit output this spec was derived from.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A reader following an in-article link reaches a real page (Priority: P1)

A visitor reading a blog post clicks a link the article promises will take them deeper into a related topic (a vendor-question guide, a policy explainer, a "learn more" CTA). Today, 32 such links across the site lead to a 404 instead of the promised content — most visibly, a "schedule a consultation" call-to-action repeated across nine different posts, which goes nowhere. This story fixes every one of those links so a reader always lands on the real page the article meant.

**Why this priority**: This is the most severe finding — it is both a direct, repeated user-facing dead end (the same broken CTA appears nine times) and an indexing problem search engines penalize. It affects the largest number of pages and the site's primary conversion path.

**Independent Test**: Crawl the site and confirm every internal link resolves to a live (2xx/3xx) page; click the repeated CTA from several different posts and confirm each lands on a real, relevant page.

**Acceptance Scenarios**:

1. **Given** a published post that links to a URL that currently 404s, **When** the site is re-crawled, **Then** that link now resolves to an existing, topically-relevant live page.
2. **Given** the repeated "schedule a consultation" call-to-action, **When** a visitor clicks it from any post, **Then** they land on the site's real scheduling/contact destination, not a 404.
3. **Given** a broken link whose promised content does not exist anywhere on the site, **When** remediation is complete, **Then** the link is either removed or its surrounding text no longer promises content that isn't there — it is not left pointing at a dead URL.

---

### User Story 2 - Search results show an accurate, clickable title and description for every page (Priority: P2)

Search engines currently truncate most of the site's page titles because every title has a long fixed phrase appended to it regardless of how long the page's own title already is — one page's title is 130 characters. Several pages (the blog index and its later pages, and every tag/category listing) also show the exact same title and description as each other, which search engines treat as duplicate content and may drop from results. This story gives every page a title and description that fits, and gives templated pages (pagination, tags, categories) their own distinct wording.

**Why this priority**: This affects how the site's existing content actually appears — and whether it appears at all — in search results. It's lower severity than dead links but affects more pages (26 with oversized titles) and directly shapes click-through.

**Independent Test**: Re-crawl the site and confirm no title exceeds the recommended length unless explicitly justified, and no two distinct pages share an identical title or meta description (aside from a page and its own canonicalized duplicate).

**Acceptance Scenarios**:

1. **Given** a blog post whose title already fully describes the post, **When** the page is rendered, **Then** the title is not extended past the point of truncation by an appended site phrase.
2. **Given** the second, third, and fourth pages of the blog listing, **When** each is rendered, **Then** each shows a distinct title and description that identifies which page it is, rather than an identical copy of page one's.
3. **Given** each tag and category listing page, **When** rendered, **Then** each has its own descriptive meta description rather than the same boilerplate sentence reused everywhere.
4. **Given** the one post with an overly long meta description, **When** rendered, **Then** its description fits within the recommended length while keeping its core message.

---

### User Story 3 - Every page has a clean, accessible heading structure and responds quickly (Priority: P3)

A handful of pages have more than one top-level heading, or jump from a top-level heading straight to a sub-sub-heading without the step in between — both of which confuse screen readers and search engines about the page's structure. Separately, a dozen pages (mostly long-form posts) take two to three seconds to respond, and a few URLs exist in two forms (with and without a trailing slash) that get linked to inconsistently. This story cleans up structure and confirms which of these are real defects versus intentional choices.

**Why this priority**: Lowest severity of the three (info/warning level in the audit) — these are quality-of-structure and performance issues rather than dead ends or missing content, but they still affect accessibility, crawl efficiency, and page-load experience.

**Independent Test**: Re-crawl the site and confirm every page has exactly one top-level heading with no level skipped, confirm previously-slow pages now respond quickly, and confirm internal links consistently use one form of each URL that exists in two forms.

**Acceptance Scenarios**:

1. **Given** the one post currently rendering two top-level headings, **When** the page is rendered, **Then** it has exactly one, with the second demoted appropriately.
2. **Given** the nine pages currently skipping a heading level, **When** each is rendered, **Then** headings descend one level at a time.
3. **Given** the pages currently responding in two-to-three seconds, **When** re-tested, **Then** they respond within normal expectations for the rest of the site.
4. **Given** a URL that currently exists in both a trailing-slash and non-trailing-slash form, **When** internal pages link to it, **Then** they consistently use the same form.
5. **Given** the taxonomy pages currently excluded from search indexing, **When** this story is complete, **Then** that exclusion has been explicitly confirmed as intentional (and left as-is) or reversed — it is not left as an unreviewed default.

### Edge Cases

- What happens when a broken link's promised topic has no existing published page to redirect to anywhere on the site? → The link is removed, or its anchor text is rewritten so it no longer promises content that doesn't exist; authoring the missing long-form content itself is a separate editorial decision outside this feature's scope (see Assumptions).
- How should a page/title be handled if shortening it below the recommended length would require cutting information central to the page's meaning? → Prioritize a title that fully and accurately describes the page's content within the recommended length; if no acceptable shorter phrasing exists, the exception must be explicitly documented rather than silently left oversized.
- What if a taxonomy page's "noindex" turns out to be an unreviewed template default rather than a deliberate choice? → Treat it as a defect and remove the directive, per Acceptance Scenario 5 above.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every internal link that currently resolves to a non-2xx/3xx status MUST be updated to point at an existing, live, topically-relevant page.
- **FR-002**: Where a broken link's anchor text describes a topic already covered by an existing published page on the site, the link MUST be repointed to that existing page.
- **FR-003**: Where a broken link's anchor text promises a topic that no existing published page covers, the link MUST be removed or its surrounding text rewritten so it no longer promises unavailable content — new long-form content MUST NOT be authored as part of this feature to fill that gap.
- **FR-004**: The repeated "schedule a consultation" call-to-action currently pointing at a dead URL MUST be repointed, everywhere it appears, to the site's real scheduling/contact destination.
- **FR-005**: Every page's title MUST fit within the recommended length (~60 characters) unless an explicit, documented exception is recorded; where a fixed site-wide phrase is being appended to an already-complete page title and pushing it over that length, the appending behavior MUST be changed so it no longer does so for that page type.
- **FR-006**: Each paginated page of the blog listing MUST have a title and meta description that are distinct from every other page in that pagination sequence and identify which page they are.
- **FR-007**: Each tag and category listing page MUST have its own meta description distinct from the others, rather than sharing one boilerplate sentence across all of them.
- **FR-008**: Any meta description exceeding the recommended maximum length (~160 characters) MUST be shortened while preserving its core message and call to action.
- **FR-009**: Any meta description below the recommended minimum length (~70 characters) MUST be expanded to a unique, informative description of that specific page.
- **FR-010**: Any page rendering more than one top-level (H1) heading MUST be corrected to exactly one, with additional instances demoted to an appropriate lower level.
- **FR-011**: Any page whose heading levels skip a step (e.g., top-level heading directly followed by a third-level heading) MUST be corrected so heading levels descend one step at a time.
- **FR-012**: For any URL that currently exists live in both a trailing-slash and non-trailing-slash form, internal links MUST consistently reference one canonical form rather than mixing both.
- **FR-013**: Each taxonomy page currently excluded from search indexing MUST have that exclusion explicitly reviewed and confirmed as an intentional editorial decision; if not intentional, the exclusion MUST be removed.
- **FR-014**: Pages currently responding in two-to-three seconds MUST be brought within the response-time range typical of the rest of the site, addressed as a shared underlying cause where multiple affected pages share one (e.g., pagination pages together), rather than as isolated one-off fixes.
- **FR-015**: After all other requirements in this feature are met, a full site audit MUST be re-run and MUST show zero occurrences of every issue type this feature addresses, or each remaining occurrence MUST carry an explicit, written justification for why it is an acceptable exception.

### Key Entities

- **Page**: A single crawlable URL on the site, with a title, a meta description, a heading structure, an indexability status (indexed/noindex), and — where applicable — a canonical target it should be treated as equivalent to.
- **Internal Link**: A reference from one page's content to another URL on the same site, carrying anchor text that describes what the reader will find at the destination, and a live/dead status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A full site crawl finds zero internal links resolving to a non-2xx/3xx status (down from 32 today).
- **SC-002**: Zero pages have a title exceeding ~60 characters without an explicitly documented exception (down from 26 today).
- **SC-003**: Zero pages share an identical title or an identical meta description with another distinct page, aside from a page and its own confirmed canonical duplicate (down from 8 duplicate occurrences today).
- **SC-004**: Every page has exactly one top-level heading and no heading-level skips (down from 1 multiple-heading page and 9 skip occurrences today).
- **SC-005**: Every page previously responding in two-to-three seconds responds in under one second on re-test (down from 12 pages today).
- **SC-006**: A follow-up full-site SEO audit reports zero critical-severity and zero warning-severity issues, with any remaining info-severity issues each carrying a documented justification.

## Assumptions

- The site's actual live content and page templates may live on a different branch or content source than the one this work starts from; this feature's changes must be made wherever the real, currently-deployed content and templates reside, not merely wherever a given work-in-progress branch happens to be.
- Two of the sixteen broken-link destinations (a referenced cybersecurity/data-stewardship companion article and a referenced "AI in church management software" hub/pillar page) do not correspond to any existing published page anywhere on the site. This feature treats writing that missing long-form content as out of scope, and resolves those two cases by removing or rewriting the dead links instead (per FR-003).
- The ~60-character title guideline, ~70–160-character meta description range, and "two-to-three seconds is slow" characterization all follow the thresholds already used by the site audit tool that produced these findings, not an independently chosen standard.
- Fixing the slow-response pages is assumed to be addressable primarily through a shared caching/generation mechanism (since the affected pages cluster around pagination and long-form posts) rather than requiring a bespoke fix per page; if investigation shows otherwise, that is a planning-phase finding, not a spec change.
- The taxonomy pages currently marked noindex are assumed, pending explicit confirmation (FR-013), to be a deliberate editorial choice rather than a template default — this feature verifies that assumption rather than presupposing an outcome.
