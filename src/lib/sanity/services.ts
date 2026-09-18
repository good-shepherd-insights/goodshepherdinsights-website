import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import { sanityClient, sanityImageUrl, type SanityInlineText } from "./client";

export interface SanityImageWithAlt {
  image?: {
    asset?: { _ref: string };
  };
  alt?: string;
  caption?: string;
}

export interface SanityServiceTextItem {
  text: SanityInlineText;
}

export interface SanityServiceSchema {
  areaServed?: Array<{
    name?: string;
    type?: "Place" | "City" | "State" | "Country" | "AdministrativeArea";
  }>;
  audience?: Array<{
    name?: string;
  }>;
  serviceOutput?: string;
  offers?: Array<{
    name?: string;
    description?: string;
    url?: string;
  }>;
}

export type SanityServiceBlock =
  | {
      _type: "serviceIntro";
      _key: string;
      title?: string;
      text: SanityInlineText;
    }
  | {
      _type: "serviceFit";
      _key: string;
      fitTitle?: string;
      intro?: string;
      fit?: string[];
      roles?: Array<{ label?: string; owns?: string }>;
      context?: string;
      nonFit?: string[];
      variant?: "columns" | "ledger" | "styled";
    }
  | {
      _type: "serviceProcess";
      _key: string;
      processTitle?: string;
      intro?: string;
      phases?: Array<{ name?: string; description?: string }>;
      clientInputs?: string[];
      outputs?: Array<{ label?: string; description?: string }>;
      timing?: string;
      variant?: "base" | "compactNeeds" | "dense";
    }
  | {
      _type: "serviceNarrative";
      _key: string;
      heading?: string;
      text: SanityInlineText;
    }
  | {
      _type: "statCallout";
      _key: string;
      value: string;
      label?: string;
      description?: string;
    }
  | {
      _type: "serviceOffering";
      _key: string;
      number?: number;
      title: string;
      description: SanityInlineText;
      audience?: string[];
      deliverables?: SanityServiceTextItem[];
      methodologySteps?: SanityServiceTextItem[];
      statCallouts?: Array<
        Extract<SanityServiceBlock, { _type: "statCallout" }>
      >;
      outcomesTitle?: string;
      outcomes?: SanityServiceTextItem[];
    }
  | {
      _type: "serviceCta";
      _key: string;
      title: string;
      text?: SanityInlineText;
      linkText: string;
      href: string;
    }
  | {
      _type: "serviceImage";
      _key: string;
      image: SanityImageWithAlt;
      video?: {
        src?: string;
        provider?: "youtube" | "vimeo" | "html5";
        id?: string;
      };
    };

export type SanityServiceHeroVariant = "columns" | "inset" | "band";

export interface SanityServiceHero {
  headline?: string;
  buyer?: string;
  problem?: string;
  promise?: string;
  outcome?: string;
  variant?: SanityServiceHeroVariant;
}

export interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  status?: "draft" | "published";
  order?: number;
  excerpt?: string;
  serviceType: string;
  schema?: SanityServiceSchema;
  heroImage?: SanityImageWithAlt;
  hero?: SanityServiceHero;
  body?: SanityServiceBlock[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
    excludeFromSitemap?: boolean;
  };
}

export interface SanityServicesIndex {
  _id: string;
  badge?: string;
  title: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  servicesList?: {
    enable?: boolean;
    layout?: "horizontal" | "listImage";
    limit?: number;
  };
  featureGrid?: ServiceFeatureGridSection;
  statsMarquee?: ServiceStatsMarqueeSection;
  processSection?: ServiceProcessSection;
  ctaVideoSection?: ServiceCtaVideoSection;
  ctaSection?: ServiceCtaSection;
  faqSection?: ServiceFaqSection;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonical?: string;
    robots?: string;
    excludeFromSitemap?: boolean;
  };
}

export interface ServiceButton {
  enable: boolean;
  label: string;
  url: string;
  variant?: "fill" | "outline" | "text" | "circle" | "white";
  hoverEffect?:
    "text-flip" | "creative-fill" | "magnetic" | "magnetic-text-flip";
}

export interface ServiceFeatureGridSection {
  enable?: boolean;
  badge?: string;
  title?: string;
  cardLayout?: "outsideIcon" | "insideIcon" | "outsideIconSquare";
  features: Array<{
    enable?: boolean;
    icon?: string;
    title: string;
    description: string;
  }>;
}

export interface ServiceStatsMarqueeSection {
  enable: boolean;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  shapeImage?: string;
  shapeImageAlt?: string;
  marquee: {
    elementWidthAuto: boolean;
    pauseOnHover: boolean;
    reverse?: "" | "reverse";
    duration: string;
    text?: string;
  };
}

export interface ServiceProcessSection {
  enable: boolean;
  badge?: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  services: Array<{
    title: string;
    description?: string;
    icon?: string;
  }>;
}

export interface ServiceCtaVideoSection {
  enable: boolean;
  badge?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  scribbleArrow?: string;
  scribbleArrowAlt?: string;
  button?: ServiceButton;
  video?: {
    src: string;
    provider?: "youtube" | "vimeo" | "html5";
    id?: string;
    autoplay?: boolean;
  };
}

export interface ServiceCtaSection {
  enable: boolean;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  humanImage?: string;
  humanImageAlt?: string;
  button?: ServiceButton;
}

export interface ServiceFaqSection {
  enable: boolean;
  title?: string;
  list?: Array<{
    enable?: boolean;
    title: string;
    content: string;
  }>;
}

const serviceFields = `
  _id,
  title,
  slug,
  status,
  order,
  excerpt,
  serviceType,
  schema,
  heroImage,
  hero,
  body,
  seo
`;

export async function getSanityServices() {
  return sanityClient.fetch<SanityService[]>(
    `*[_type == "service" && status == "published" && defined(slug.current)] | order(order asc, title asc){
      ${serviceFields}
    }`,
  );
}

export async function getSanityService(slug: string) {
  return sanityClient.fetch<SanityService | null>(
    `*[_type == "service" && status == "published" && slug.current == $slug][0]{
      ${serviceFields}
    }`,
    { slug },
  );
}

export async function getSanityServicesIndex() {
  return sanityClient.fetch<SanityServicesIndex | null>(
    `*[_type == "serviceIndex" && _id == "service-index"][0]{
      _id,
      badge,
      title,
      excerpt,
      "image": heroImage.image.asset->url,
      "imageAlt": heroImage.alt,
      servicesList,
      featureGrid,
      statsMarquee{
        enable,
        "backgroundImage": backgroundImage.image.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        "shapeImage": shapeImage.image.asset->url,
        "shapeImageAlt": shapeImage.alt,
        marquee
      },
      processSection{
        enable,
        badge,
        title,
        description,
        "image": image.image.asset->url,
        "imageAlt": image.alt,
        services
      },
      ctaVideoSection{
        enable,
        badge,
        title,
        description,
        "backgroundImage": backgroundImage.image.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        scribbleArrow,
        scribbleArrowAlt,
        button,
        video
      },
      ctaSection{
        enable,
        title,
        description,
        "backgroundImage": backgroundImage.image.asset->url,
        "backgroundImageAlt": backgroundImage.alt,
        "humanImage": select(
          defined(humanImage.image.asset->url) => humanImage.image.asset->url + "?w=180&h=242&fit=max&auto=format",
          null
        ),
        "humanImageAlt": humanImage.alt,
        button
      },
      faqSection,
      seo
    }`,
  );
}

export async function getSanityServiceSlugs() {
  return sanityClient.fetch<string[]>(
    `*[_type == "service" && status == "published" && defined(slug.current)].slug.current`,
  );
}

export const serviceUrl = (service: SanityService | string, locale?: string) =>
  getLocaleUrlCTM(
    typeof service === "string" ? service : service.slug.current,
    locale,
    "/services",
  );

export const serviceImageUrl = (
  imageOrService?: SanityImageWithAlt | SanityService,
  width = 900,
  height?: number,
) => {
  const image = (
    imageOrService && "heroImage" in imageOrService
      ? imageOrService.heroImage
      : imageOrService
  ) as SanityImageWithAlt | undefined;
  const asset = image?.image?.asset;
  if (!asset) return undefined;

  const builder = sanityImageUrl(asset).width(width).auto("format");
  return height ? builder.height(height).fit("crop").url() : builder.url();
};

const inlineTextToPlain = (value: SanityInlineText): string =>
  value
    .map((block) =>
      (block.children || [])
        .map((span) => span.text)
        .join("")
        .trim(),
    )
    .filter(Boolean)
    .join("\n\n");

export type ServiceHeroContent = {
  service: string;
  headline: string;
  buyer?: string;
  problem?: string;
  promise?: string;
  outcomeLabel: string;
  outcome: string;
  cta: { label: string; href: string };
  image?: { src: string; alt: string };
};

/**
 * Assembles ServiceHero content from a service document.
 * Hero fields (CMS) win; documented fallbacks keep pages rendering for services
 * that have not filled the hero object in yet. Throws only when the service
 * cannot produce the required CTA, outcome label, or title.
 */
export const getServiceHeroContent = (
  service: SanityService,
): ServiceHeroContent | null => {
  const ctaBlock = service.body?.find((block) => block._type === "serviceCta");
  if (!ctaBlock || !ctaBlock.linkText || !ctaBlock.href) return null;

  const image = serviceImageUrl(service, 1024, 1024);
  const hero = service.hero || {};

  const buyer = hero.buyer?.trim();
  const problem = hero.problem?.trim();
  const promise = hero.promise?.trim();
  const outcome =
    hero.outcome?.trim() ||
    (ctaBlock.text ? inlineTextToPlain(ctaBlock.text) : "");

  if (!buyer && !problem && !promise && !outcome) return null;

  return {
    service: service.title,
    headline: hero.headline?.trim() || service.excerpt || service.title,
    buyer,
    problem,
    promise,
    outcomeLabel: ctaBlock.title,
    outcome,
    cta: { label: ctaBlock.linkText, href: ctaBlock.href },
    image: image
      ? { src: image, alt: service.heroImage?.alt || service.title }
      : undefined,
  };
};

export type ServiceFitRender = {
  content: import("../../components/widgets/ServiceFitQualification.astro").ServiceFitContent;
  variant: "columns" | "ledger" | "styled";
};

/**
 * Maps a serviceFit body block to ServiceFitQualification props.
 * The CTA is resolved from the sibling serviceCta block (single source of
 * truth). Returns null when the block has no meaningful content or the
 * service has no usable serviceCta — explicit, never silently partial.
 */
export const getServiceFitRender = (
  block: Extract<SanityServiceBlock, { _type: "serviceFit" }>,
  service: SanityService,
): ServiceFitRender | null => {
  const fit = (block.fit || []).map((item) => item?.trim()).filter(Boolean) as string[];
  const roles = (block.roles || [])
    .map((role) => ({ label: role.label?.trim() || "", owns: role.owns?.trim() || "" }))
    .filter((role) => role.label && role.owns);
  const nonFit = (block.nonFit || []).map((item) => item?.trim()).filter(Boolean) as string[];

  if (fit.length === 0 && roles.length === 0 && nonFit.length === 0) return null;

  const ctaBlock = service.body?.find((b) => b._type === "serviceCta");
  if (!ctaBlock || !ctaBlock.linkText || !ctaBlock.href) return null;

  return {
    content: {
      fitTitle: block.fitTitle?.trim() || "Who This Is For",
      intro: block.intro?.trim() || undefined,
      fit,
      roles,
      context: block.context?.trim() || undefined,
      nonFit,
      cta: { label: ctaBlock.linkText, href: ctaBlock.href },
    },
    variant: block.variant || "styled",
  };
};

export type ServiceProcessRender = {
  content: import("../../components/widgets/ServiceEngagementProcess.astro").ServiceProcessContent;
  variant: "base" | "compactNeeds" | "dense";
};

/**
 * Maps a serviceProcess body block to ServiceEngagementProcess props.
 * Returns null when the block has no meaningful content — explicit, never
 * silently partial. Row positions are fixed by the component: phases, then
 * client inputs, then outputs — never rearranged.
 */
export const getServiceProcessRender = (
  block: Extract<SanityServiceBlock, { _type: "serviceProcess" }>,
  service: SanityService,
): ServiceProcessRender | null => {
  const phases = (block.phases || [])
    .map((phase) => ({ name: phase.name?.trim() || "", description: phase.description?.trim() || "" }))
    .filter((phase) => phase.name && phase.description);
  const clientInputs = (block.clientInputs || []).map((item) => item?.trim()).filter(Boolean) as string[];
  const outputs = (block.outputs || [])
    .map((output) => ({ label: output.label?.trim() || "", description: output.description?.trim() || "" }))
    .filter((output) => output.label);

  if (phases.length === 0) return null;

  const ctaBlock = service.body?.find((b) => b._type === "serviceCta");

  return {
    content: {
      processTitle: block.processTitle?.trim() || "How the Engagement Works",
      intro: block.intro?.trim() || undefined,
      phases,
      clientInputs: clientInputs.length > 0 ? clientInputs : undefined,
      outputs: outputs.length > 0 ? outputs : undefined,
      timing: block.timing?.trim() || undefined,
      cta: ctaBlock && ctaBlock.linkText && ctaBlock.href ? { label: ctaBlock.linkText, href: ctaBlock.href } : undefined,
    },
    variant: block.variant || "base",
  };
};
