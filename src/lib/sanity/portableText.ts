import { escapeHTML, toHTML, uriLooksSafe } from "@portabletext/to-html";
import type { MarkdownHeading } from "astro";
import type { TocHeading } from "@/types";
import buildToc from "@/lib/utils/buildToc";
import { removeWhitespace, slugifyyy } from "@/lib/utils/textConverter";
import {
  sanityImageUrl,
  type SanityBody,
  type SanityInlineText,
  type SanityLegacyBodyBlock,
} from "./client";

type PortableTextHeadingData = {
  headings: MarkdownHeading[];
  tocHeadings: TocHeading[];
  slugByBlockKey: Map<string, string>;
};

type PortableTextBlockRenderOptions = {
  children?: string;
  value: {
    _key?: string;
  };
};

export type PortableTextSection =
  | {
      type: "html";
      html: string;
    }
  | {
      type: "toc";
      title: string;
      toc: TocHeading[];
    }
  | {
      type: "faq";
      heading: string;
      items: Array<{
        title: string;
        content: string;
        contentIsHtml: true;
      }>;
    };

export function portableTextToHtml(
  value: SanityBody[] | SanityInlineText,
  options?: { headingData?: PortableTextHeadingData },
): string {
  const blocks = value as SanityBody[];
  const headingData =
    options?.headingData || buildPortableTextHeadingData(blocks);

  return toHTML(blocks as never[], {
    components: {
      block: {
        h2: ({
          children = "",
          value,
        }: PortableTextBlockRenderOptions): string =>
          renderLegacyHeading("h2", children, value._key || "", headingData),
        h3: ({
          children = "",
          value,
        }: PortableTextBlockRenderOptions): string =>
          renderLegacyHeading("h3", children, value._key || "", headingData),
      },
      types: {
        tldr: ({ value }: { value: { text: SanityInlineText } }): string =>
          `<aside class="article-tldr rounded-lg border border-primary/20 bg-primary/5 p-6"><p class="mb-2 text-sm font-bold uppercase tracking-widest text-primary">TL;DR</p>${portableTextToHtml(value.text)}</aside>`,
        insightList: ({
          value,
        }: {
          value: { heading: string; items: Array<{ text: SanityInlineText }> };
        }): string =>
          `<section class="article-insights rounded-lg border border-border-dark/15 bg-light p-6"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><ul>${value.items.map((item) => `<li>${portableTextToHtml(item.text)}</li>`).join("")}</ul></section>`,
        callout: ({
          value,
        }: {
          value: { label: string; text: SanityInlineText };
        }): string =>
          `<aside class="article-callout rounded-lg border-s-4 border-primary bg-primary/5 px-6 py-4">${portableTextToHtml(value.text)}</aside>`,
        takeaways: ({
          value,
        }: {
          value: { heading: string; items: Array<{ text: SanityInlineText }> };
        }): string =>
          `<section class="article-takeaways rounded-lg bg-light p-6"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><ul>${value.items.map((item) => `<li>${portableTextToHtml(item.text)}</li>`).join("")}</ul></section>`,
        tableOfContents: (): string => "",
        faq: ({
          value,
        }: {
          value: {
            heading: string;
            items: Array<{ question: string; answer: SanityBody[] }>;
          };
        }): string =>
          `<section class="article-faq"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><div class="hs-accordion-group mx-auto flex w-full flex-col gap-0">${value.items
            .map((item, index) => {
              const accordionId = `article-faq-${index}`;
              const contentId = `${accordionId}-content`;
              const expanded = index === 0;
              return `<div class="hs-accordion relative px-4 py-1 text-start transition-all lg:px-6${expanded ? " active" : ""}" id="${accordionId}"><button id="${accordionId}-toggle" type="button" aria-expanded="${expanded}" aria-controls="${contentId}" class="hs-accordion-toggle font-secondary text-h6 flex w-full items-center justify-between border-b border-transparent py-5.5 text-start font-medium hs-accordion-active:border-border-light"><span class="text-h6 sm:text-h6-sm text-inherit">${escapeHTML(item.question)}</span><span aria-hidden="true" class="hs-accordion-active:-rotate-90 pointer-events-none flex h-5 w-5 rotate-45 border-e-2 border-b-2 border-current text-xl text-inherit transition-transform"></span></button><div role="region" id="${contentId}" aria-labelledby="${accordionId}-toggle" class="hs-accordion-content hs-accordion-active:opacity-100 w-full overflow-hidden opacity-0 transition-all duration-300 ease-linear${expanded ? "" : " hidden"}"><div class="py-4"><div class="text-inherit opacity-90">${portableTextToHtml(item.answer)}</div></div></div></div>`;
            })
            .join("")}</div></section>`,
        sources: ({
          value,
        }: {
          value: {
            heading: string;
            items: Array<{
              title: string;
              url?: string;
              publisher?: string;
              publishedAt?: string;
            }>;
          };
        }): string =>
          `<section class="article-sources"><h2 class="mt-0">${escapeHTML(value.heading)}</h2><ul>${value.items.map((item) => `<li>${item.url && uriLooksSafe(item.url) ? `<a href="${escapeHTML(item.url)}">${escapeHTML(item.title)}</a>` : escapeHTML(item.title)}${item.publisher ? ` — ${escapeHTML(item.publisher)}` : ""}${item.publishedAt ? `, ${escapeHTML(item.publishedAt)}` : ""}</li>`).join("")}</ul></section>`,
        framework: ({
          value,
        }: {
          value: {
            heading: string;
            steps: Array<{
              number: number;
              title: string;
              explanation: SanityBody[];
            }>;
          };
        }): string =>
          `<section class="article-framework"><h2 class="mt-0">${escapeHTML(value.heading)}</h2>${value.steps.map((step) => `<div class="mb-6"><h3>${step.number}. ${escapeHTML(step.title)}</h3>${portableTextToHtml(step.explanation)}</div>`).join("")}</section>`,
        vendorProfile: ({
          value,
        }: {
          value: {
            name: string;
            officialLinks: Array<{ label: string; url: string }>;
            marketPosition: string;
            bestFor: string;
            coreStrengths: string[];
            limitations: string[];
            pricing: string;
            selectionCriteria: string[];
          };
        }): string =>
          `<section class="article-vendor-profile"><h3 class="mt-0">${escapeHTML(value.name)}</h3><p><strong>Market position:</strong> ${escapeHTML(value.marketPosition)}</p><p><strong>Best for:</strong> ${escapeHTML(value.bestFor)}</p><p><strong>Pricing:</strong> ${escapeHTML(value.pricing)}</p><h4>Core strengths</h4><ul>${value.coreStrengths.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><h4>Limitations</h4><ul>${value.limitations.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><h4>When to choose</h4><ul>${value.selectionCriteria.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul><p>${value.officialLinks.map((link) => (uriLooksSafe(link.url) ? `<a href="${escapeHTML(link.url)}">${escapeHTML(link.label)}</a>` : "")).join(" · ")}</p></section>`,
        useCase: ({
          value,
        }: {
          value: {
            title: string;
            churchProfile: string;
            recommendation: string;
            rationale: string;
            budget: string;
          };
        }): string =>
          `<section class="article-use-case"><h3 class="mt-0">${escapeHTML(value.title)}</h3><p><strong>Church profile:</strong> ${escapeHTML(value.churchProfile)}</p><p><strong>Recommendation:</strong> ${escapeHTML(value.recommendation)}</p><p><strong>Rationale:</strong> ${escapeHTML(value.rationale)}</p><p><strong>Budget:</strong> ${escapeHTML(value.budget)}</p></section>`,
        bodyImage: ({
          value,
        }: {
          value: { asset?: unknown; alt?: string };
        }): string => {
          if (!value?.asset) return "";

          const src = sanityImageUrl(value.asset)
            .width(896)
            .auto("format")
            .url();
          const alt = escapeHTML(value.alt || "");

          return `<figure><img src="${escapeHTML(src)}" alt="${alt}" loading="lazy" decoding="async" class="h-auto w-full rounded-xl" /></figure>`;
        },
        divider: (): string => '<hr class="border-border-dark/20" />',
      },
      marks: {
        link: ({
          children,
          value,
        }: {
          children: string;
          value?: { href?: string; openInNewTab?: boolean };
        }): string => linkMarkup(children, value),
        inlineLink: ({
          children,
          value,
        }: {
          children: string;
          value?: { href?: string; openInNewTab?: boolean };
        }): string => linkMarkup(children, value),
        constrainedLink: ({
          children,
          value,
        }: {
          children: string;
          value?: { href?: string; openInNewTab?: boolean };
        }): string => linkMarkup(children, value),
      },
      hardBreak: () => "<br />",
    },
  });
}

export function portableTextToSections(
  value: SanityBody[],
): PortableTextSection[] {
  const headingData = buildPortableTextHeadingData(value);
  const sections: PortableTextSection[] = [];
  let htmlParts: string[] = [];
  let legacyChunk: SanityLegacyBodyBlock[] = [];

  const flushLegacyChunk = () => {
    if (!legacyChunk.length) return;
    htmlParts.push(portableTextToHtml(legacyChunk, { headingData }));
    legacyChunk = [];
  };

  const flushHtmlParts = () => {
    flushLegacyChunk();
    if (!htmlParts.length) return;

    sections.push({
      type: "html",
      html: htmlParts.join(""),
    });
    htmlParts = [];
  };

  for (let index = 0; index < value.length; index += 1) {
    const block = value[index];

    if (block._type === "articleSection") {
      flushLegacyChunk();
      htmlParts.push(renderArticleSection(block, headingData));
      continue;
    }

    if (block._type === "articleList") {
      flushLegacyChunk();
      htmlParts.push(renderArticleList(block, headingData));
      continue;
    }

    if (block._type === "tableOfContents") {
      flushHtmlParts();
      if (headingData.tocHeadings.length > 0) {
        sections.push({
          type: "toc",
          title: block.title || "Table of Contents",
          toc: headingData.tocHeadings,
        });
      }
      continue;
    }

    if (isLegacyTocSectionStart(value, index)) {
      flushHtmlParts();
      if (headingData.tocHeadings.length > 0) {
        sections.push({
          type: "toc",
          title:
            block._type === "block"
              ? getPortableTextBlockText(block) || "Table of Contents"
              : "Table of Contents",
          toc: headingData.tocHeadings,
        });
      }
      while (index + 1 < value.length && isLegacyListBlock(value[index + 1])) {
        index += 1;
      }
      continue;
    }

    if (block._type === "faq") {
      flushHtmlParts();
      sections.push({
        type: "faq",
        heading: block.heading,
        items: block.items.map((item) => ({
          title: item.question,
          content: portableTextToHtml(item.answer),
          contentIsHtml: true,
        })),
      });
      continue;
    }

    if (isLegacyBodyBlock(block)) {
      legacyChunk.push(block);
      continue;
    }

    flushLegacyChunk();
    htmlParts.push(portableTextToHtml([block], { headingData }));
  }

  flushHtmlParts();

  return sections;
}

function buildPortableTextHeadingData(
  value: SanityBody[],
): PortableTextHeadingData {
  const headings: MarkdownHeading[] = [];
  const slugByBlockKey = new Map<string, string>();
  const slugCounts = new Map<string, number>();

  const registerHeading = (key: string, text: string, depth: 2 | 3) => {
    if (!text) return;
    const slug = createUniqueSlug(text, slugCounts, headings.length + 1);
    slugByBlockKey.set(key, slug);
    headings.push({ depth, slug, text });
  };

  for (let index = 0; index < value.length; index += 1) {
    const block = value[index];

    if (block._type === "tableOfContents") continue;

    if (isLegacyTocSectionStart(value, index)) {
      while (index + 1 < value.length && isLegacyListBlock(value[index + 1])) {
        index += 1;
      }
      continue;
    }

    if (block._type === "articleSection") {
      if (block.header) {
        registerHeading(
          block._key,
          block.header,
          block.headerLevel === "h3" ? 3 : 2,
        );
      }
      continue;
    }

    if (block._type === "articleList") {
      if (block.header) {
        registerHeading(
          block._key,
          block.header,
          block.headerLevel === "h3" ? 3 : 2,
        );
      }
      continue;
    }

    if (
      block._type === "faq" ||
      block._type === "takeaways" ||
      block._type === "sources" ||
      block._type === "framework"
    ) {
      registerHeading(block._key, block.heading, 2);
      continue;
    }

    if (isLegacyHeadingBlock(block)) {
      registerHeading(
        block._key,
        getPortableTextBlockText(block),
        block.style === "h3" ? 3 : 2,
      );
    }
  }

  return {
    headings,
    tocHeadings: buildToc(headings),
    slugByBlockKey,
  };
}

function renderArticleSection(
  section: Extract<SanityBody, { _type: "articleSection" }>,
  headingData: PortableTextHeadingData,
) {
  const heading =
    section.header && section.header.trim()
      ? renderStructuredHeading(
          section.headerLevel === "h3" ? "h3" : "h2",
          section.header,
          section._key,
          headingData,
        )
      : "";

  return `<section class="article-section">${heading}${portableTextToHtml(section.paragraphs)}</section>`;
}

function renderArticleList(
  section: Extract<SanityBody, { _type: "articleList" }>,
  headingData: PortableTextHeadingData,
) {
  const tag = section.style === "number" ? "ol" : "ul";
  const heading =
    section.header && section.header.trim()
      ? renderStructuredHeading(
          section.headerLevel === "h3" ? "h3" : "h2",
          section.header,
          section._key,
          headingData,
        )
      : "";
  return `<section class="article-list">${heading}<${tag}>${section.items
    .map((item) => `<li>${portableTextToHtml(item.text)}</li>`)
    .join("")}</${tag}></section>`;
}

function renderStructuredHeading(
  tag: "h2" | "h3",
  text: string,
  key: string,
  headingData: PortableTextHeadingData,
) {
  const slug = headingData.slugByBlockKey.get(key);
  const idAttr = slug ? ` id="${escapeHTML(slug)}"` : "";
  return `<${tag}${idAttr}>${escapeHTML(text)}</${tag}>`;
}

function renderLegacyHeading(
  tag: "h2" | "h3",
  children: string,
  key: string,
  headingData: PortableTextHeadingData,
) {
  const slug = headingData.slugByBlockKey.get(key);
  const idAttr = slug ? ` id="${escapeHTML(slug)}"` : "";
  return `<${tag}${idAttr}>${children}</${tag}>`;
}

function isLegacyBodyBlock(block: SanityBody): block is SanityLegacyBodyBlock {
  return block._type === "block";
}

function isLegacyHeadingBlock(
  block: SanityBody,
): block is SanityLegacyBodyBlock & { style: "h2" | "h3" } {
  return (
    block._type === "block" && (block.style === "h2" || block.style === "h3")
  );
}

function isLegacyListBlock(block: SanityBody): block is SanityLegacyBodyBlock {
  return block._type === "block" && !!block.listItem;
}

function isLegacyTocHeading(block: SanityBody) {
  return (
    isLegacyHeadingBlock(block) &&
    getPortableTextBlockText(block).toLowerCase() === "table of contents"
  );
}

function isLegacyTocSectionStart(value: SanityBody[], index: number) {
  return (
    isLegacyTocHeading(value[index]) &&
    index + 1 < value.length &&
    isLegacyListBlock(value[index + 1])
  );
}

function getPortableTextBlockText(block: SanityLegacyBodyBlock) {
  return removeWhitespace(
    block.children
      .map((child) => ("text" in child ? child.text : ""))
      .join(" "),
  );
}

function createUniqueSlug(
  text: string,
  slugCounts: Map<string, number>,
  fallbackIndex: number,
) {
  const baseSlug = slugifyyy(text) || `section-${fallbackIndex}`;
  const seenCount = slugCounts.get(baseSlug) || 0;
  const nextCount = seenCount + 1;

  slugCounts.set(baseSlug, nextCount);

  return nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`;
}

function linkMarkup(
  children: string,
  value?: { href?: string; openInNewTab?: boolean },
) {
  const href = value?.href || "";
  if (!uriLooksSafe(href)) return children;
  const target = value?.openInNewTab ? ' target="_blank"' : "";
  const rel = value?.openInNewTab ? ' rel="noopener noreferrer nofollow"' : "";
  return `<a href="${escapeHTML(href)}"${target}${rel}>${children}</a>`;
}
