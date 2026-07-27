import {
  escapeHTML,
  toHTML,
  uriLooksSafe,
} from "@portabletext/to-html";
import { sanityImageUrl, type SanityBody } from "./client";

export function portableTextToHtml(value: SanityBody[]): string {
  return toHTML(value as never[], {
    components: {
      types: {
        tldr: ({value}: {value: {text: SanityBody[]}}): string =>
          `<aside class="article-tldr my-4 rounded-lg border border-primary/20 bg-primary/5 p-6"><p class="mb-2 text-sm font-bold uppercase tracking-widest text-primary">TL;DR</p>${portableTextToHtml(value.text)}</aside>`,
        insightList: ({value}: {value: {heading: string; items: Array<{text: SanityBody[]}>}}): string =>
          `<section class="article-insights my-4 rounded-lg border border-border-dark/15 bg-light p-6"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><ul>${value.items.map((item) => `<li>${portableTextToHtml(item.text)}</li>`).join("")}</ul></section>`,
        callout: ({value}: {value: {label: string; text: SanityBody[]}}): string =>
          `<aside class="article-callout my-4 rounded-lg border-s-4 border-primary bg-primary/5 px-6 py-4"><strong>${escapeHTML(value.label)}:</strong> ${portableTextToHtml(value.text)}</aside>`,
        takeaways: ({value}: {value: {heading: string; items: Array<{text: SanityBody[]}>}}): string =>
          `<section class="article-takeaways my-4 rounded-lg bg-light p-6"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><ul>${value.items.map((item) => `<li>${portableTextToHtml(item.text)}</li>`).join("")}</ul></section>`,
        faq: ({value}: {value: {heading: string; items: Array<{question: string; answer: SanityBody[]}>}}): string =>
          `<section class="article-faq my-4"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><div class="hs-accordion-group mx-auto flex w-full flex-col gap-0">${value.items.map((item, index) => {
            const accordionId = `article-faq-${index}`;
            const contentId = `${accordionId}-content`;
            const expanded = index === 0;
            return `<div class="hs-accordion relative px-4 py-1 text-start transition-all lg:px-6${expanded ? " active" : ""}" id="${accordionId}"><button id="${accordionId}-toggle" type="button" aria-expanded="${expanded}" aria-controls="${contentId}" class="hs-accordion-toggle font-secondary text-h6 flex w-full items-center justify-between border-b border-transparent py-5.5 text-start font-medium hs-accordion-active:border-border-light"><span class="text-h6 sm:text-h6-sm text-inherit">${escapeHTML(item.question)}</span><span aria-hidden="true" class="hs-accordion-active:-rotate-90 pointer-events-none flex h-5 w-5 rotate-45 border-e-2 border-b-2 border-current text-xl text-inherit transition-transform"></span></button><div role="region" id="${contentId}" aria-labelledby="${accordionId}-toggle" class="hs-accordion-content hs-accordion-active:opacity-100 w-full overflow-hidden opacity-0 transition-all duration-300 ease-linear${expanded ? "" : " hidden"}"><div class="py-4"><div class="text-inherit opacity-90">${portableTextToHtml(item.answer)}</div></div></div></div>`;
          }).join("")}</div></section>`,
        sources: ({value}: {value: {heading: string; items: Array<{title: string; url?: string; publisher?: string; publishedAt?: string}>}}): string =>
          `<section class="article-sources my-4"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><ul>${value.items.map((item) => `<li>${item.url && uriLooksSafe(item.url) ? `<a href="${escapeHTML(item.url)}">${escapeHTML(item.title)}</a>` : escapeHTML(item.title)}${item.publisher ? ` — ${escapeHTML(item.publisher)}` : ""}${item.publishedAt ? `, ${escapeHTML(item.publishedAt)}` : ""}</li>`).join("")}</ul></section>`,
        framework: ({value}: {value: {heading: string; steps: Array<{number: number; title: string; explanation: SanityBody[]}>}}): string =>
          `<section class="article-framework my-4"><h2 class="mt-0">${escapeHTML(value.heading)}</h2>${value.steps.map((step) => `<div class="mb-6"><h3>${step.number}. ${escapeHTML(step.title)}</h3>${portableTextToHtml(step.explanation)}</div>`).join("")}</section>`,
        vendorProfile: ({value}: {value: {name: string; officialLinks: Array<{label: string; url: string}>; marketPosition: string; bestFor: string; coreStrengths: string[]; limitations: string[]; pricing: string; selectionCriteria: string[]}}): string =>
          `<section class="article-vendor-profile my-4"><h3 class="mt-0">${escapeHTML(value.name)}</h3><p><strong>Market position:</strong> ${escapeHTML(value.marketPosition)}</p><p><strong>Best for:</strong> ${escapeHTML(value.bestFor)}</p><p><strong>Pricing:</strong> ${escapeHTML(value.pricing)}</p><h4>Core strengths</h4><ul>${value.coreStrengths.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><h4>Limitations</h4><ul>${value.limitations.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><h4>When to choose</h4><ul>${value.selectionCriteria.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><p>${value.officialLinks.map((link) => uriLooksSafe(link.url) ? `<a href="${escapeHTML(link.url)}">${escapeHTML(link.label)}</a>` : "").join(" · ")}</p></section>`,
        useCase: ({value}: {value: {title: string; churchProfile: string; recommendation: string; rationale: string; budget: string}}): string =>
          `<section class="article-use-case my-4"><h3 class="mt-0">${escapeHTML(value.title)}</h3><p><strong>Church profile:</strong> ${escapeHTML(value.churchProfile)}</p><p><strong>Recommendation:</strong> ${escapeHTML(value.recommendation)}</p><p><strong>Rationale:</strong> ${escapeHTML(value.rationale)}</p><p><strong>Budget:</strong> ${escapeHTML(value.budget)}</p></section>`,
        bodyImage: ({ value }: { value: { asset?: unknown; alt?: string } }): string => {
          if (!value?.asset) return "";

          const src = sanityImageUrl(value.asset).width(896).auto("format").url();
          const alt = escapeHTML(value.alt || "");

          return `<figure class="my-4"><img src="${escapeHTML(src)}" alt="${alt}" loading="lazy" decoding="async" class="h-auto w-full rounded-xl" /></figure>`;
        },
        divider: (): string => '<hr class="my-4 border-border-dark/20" />',
      },
      marks: {
        link: ({ children, value }: { children: string; value?: { href?: string; openInNewTab?: boolean } }): string => {
          const href = value?.href || "";
          if (!uriLooksSafe(href)) return children;

          const target = value?.openInNewTab ? ' target="_blank"' : "";
          const rel = value?.openInNewTab ? ' rel="noopener noreferrer nofollow"' : "";
          return `<a href="${escapeHTML(href)}"${target}${rel}>${children}</a>`;
        },
        inlineLink: ({ children, value }: { children: string; value?: { href?: string; openInNewTab?: boolean } }): string =>
          linkMarkup(children, value),
        constrainedLink: ({ children, value }: { children: string; value?: { href?: string; openInNewTab?: boolean } }): string =>
          linkMarkup(children, value),
      },
      hardBreak: () => "<br />",
    },
  });
}

function linkMarkup(children: string, value?: {href?: string; openInNewTab?: boolean}) {
  const href = value?.href || "";
  if (!uriLooksSafe(href)) return children;
  const target = value?.openInNewTab ? ' target="_blank"' : "";
  const rel = value?.openInNewTab ? ' rel="noopener noreferrer nofollow"' : "";
  return `<a href="${escapeHTML(href)}"${target}${rel}>${children}</a>`;
}
