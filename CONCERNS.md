# PR #121 Concerns

This document records the review concerns identified for PR #121. They are
documented here for follow-up; this PR does not implement the remediation.

## Blocking correctness concerns

- `fallbackEmail` is referenced by the shipped client-side ContactForm bundle
  without being defined in that client scope. Formspree submission handling
  and the shared failure path can throw `ReferenceError: fallbackEmail is not
  defined`.
- `CommentForm.astro` still calls `formspreeSubmit` with three arguments after
  its signature was changed to require four.
- `astro check` reports six PR-introduced errors under `src/`: three
  `fallbackEmail` errors in `ContactForm.astro`, the argument-count error in
  `CommentForm.astro`, and two `FaqSection.astro` errors (`searchPlaceholder`
  is absent from the section type; `label` is specified more than once).

## Test and repository hygiene concerns

- The SEO content report writes `.context/seo-content-report.json`, but
  `.context/` is not ignored, leaving generated files untracked after tests.
- The green CI build did not catch the client-bundle undefined identifier or
  the Astro typecheck regressions.
- The sitemap test compares counts and membership rather than exact canonical
  and sitemap sets, so duplicate canonicals and orphan sitemap entries can
  pass the gate.

## Scope and reviewability concerns

- The PR description covers the FAQ merge and blog comment count, but the
  branch also includes fallback-removal work and deletion of the SEO planning
  specification files.
- The PR should either split those unrelated changes or explicitly document
  them and update its verification claims.
- The review claimed changed-file typecheck cleanliness; that claim is false
  while the six source errors remain.

## Status

These concerns are preserved here at the user's request. No remediation is
being performed as part of this documentation change.
