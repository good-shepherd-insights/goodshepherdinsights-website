# Data Model: SEO Audit Remediation

This feature edits content and rendering behavior; it does not introduce a
database or new persisted entity types. The two conceptual entities from the
spec map directly onto existing, already-schema'd frontmatter fields.

## Page

Represents one crawlable URL — a blog post, the homepage, a blog-listing
pagination page, or a tag/category listing. Backed by existing Astro content
collection entries (`content.config.ts` → `basePage` schema) and route files
under `src/pages/[...lang]/`.

| Field | Existing source | Relevant to this feature because |
|---|---|---|
| `title` | frontmatter `title` (required) | Combined with `tagline`/`taglineSeparator` at render time (R2); must stay accurate and complete on its own once tagline-appending is suppressed |
| `metaTitle` | frontmatter `metaTitle` (optional override of `title` for SEO) | Used where `title` alone isn't the right SEO title |
| `metaDescription` | frontmatter `metaDescription` (optional) | Must be unique per page and within ~70-160 chars (spec FR-008/FR-009) |
| `disableTagline` | frontmatter `disableTagline: boolean` (already in schema) | The mechanism this feature uses to stop tagline-appending on post/pagination/homepage pages (R2) — no schema change needed |
| `robots` | frontmatter/prop `robots` (optional, e.g. `"noindex, follow"`) | Already set on taxonomy pages; this feature only needs to confirm intent (spec FR-013), not add the field |
| `canonical` | frontmatter/prop `canonical` (optional) | Already correctly set on the three known trailing-slash duplicate pairs; not modified by this feature |
| heading structure | page body content (Markdown/MDX → rendered HTML headings) | Must have exactly one H1 and no level skips (spec FR-010/FR-011) |

No new fields are added to the `basePage` schema in `content.config.ts`.

## Internal Link

Represents a hyperlink from one page's body content to another URL on the same
site. Not a modeled/typed entity in the codebase — these are raw `<a href="...">`
tags authored directly inside MDX post bodies (confirmed via `git grep` against
`origin/production`, R3).

| Attribute | Notes |
|---|---|
| Source page | The `.mdx` file containing the `<a>` tag |
| Target URL | Either an existing live path (fix: correct the href) or a URL with no matching content anywhere on the site (fix: remove the link/rewrite anchor text, per spec FR-003) |
| Anchor text | Used as the evidence basis for matching a broken link to its correct replacement (R3) — not changed unless the link is being removed rather than repointed |

No link-tracking table or redirect map is introduced (per research R3 —
correcting the source link is preferred over adding redirects for what are
authoring mistakes, not renamed/moved pages).
