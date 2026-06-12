/**
 * JSON-LD Generator
 * Generates an array of JSON-LD schema objects for astro-seo-schema <Schema item={...}>.
 * Each object gets @id for Google entity graph linking.
 * Returns [websiteSchema, organizationSchema, pageSchema, breadcrumbSchema].
 */
import { absoluteUrl } from "./absoluteUrl";
import { getLocaleUrlCTM } from "./i18nUtils";
import removeEmptyKeys from "./removeEmptyKeys";
import trailingSlashChecker from "./trailingSlashChecker";
import social from "@/config/social.json";

export type JSONLDProps = {
  canonical?: string;
  title?: string;
  description?: string;
  image?: string;
  categories?: string[];
  author?: string;
  pageType?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  datePublished?: string;
  dateModified?: string;
  serviceType?: string;
  [key: string]: any;
};

function generateBreadcrumb(canonical: string, title: string, baseUrl: string): Record<string, any> {
  // Ensure canonical is an absolute URL for URL parsing
  let absoluteCanonical = canonical;
  if (!canonical.startsWith("http")) {
    absoluteCanonical = absoluteUrl(canonical.startsWith("/") ? canonical : `/${canonical}`, { url: { href: baseUrl } } as any);
  }

  const path = new URL(absoluteCanonical).pathname.replace(/\/$/, "");
  const segments = path.split("/").filter(Boolean);
  const items: Array<Record<string, any>> = [
    { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
  ];

  if (segments.length > 0) {
    segments.forEach((seg, i) => {
      items.push({
        "@type": "ListItem",
        position: i + 2,
        name: i === segments.length - 1 ? title : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
        item: `${baseUrl}${segments.slice(0, i + 1).join("/")}`,
      });
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteCanonical}#breadcrumb`,
    itemListElement: items,
  };
}

export default function JsonLdGenerator(content: JSONLDProps, Astro: any): any[] {
  let {
    canonical = "/",
    title = "",
    description = "",
    image = "",
    pageType = "",
    lang = "en",
    alternateLangs = [],
    faqItems,
    datePublished,
    dateModified,
    serviceType,
    config,
  } = content || {};

  const baseUrl = trailingSlashChecker(Astro.url.origin);
  const siteTitle = config.site.title +
    (config.site.tagline && (config.site.taglineSeparator || " - ") + config.site.tagline);

  const orgData = config.seo.organization || {};

  // Ensure canonical is absolute for @id references
  if (!canonical.startsWith("http")) {
    canonical = absoluteUrl(canonical.startsWith("/") ? canonical : `/${canonical}`, Astro);
  }

  // Build @id base (baseUrl without trailing slash for clean @id construction)
  const baseUrlClean = baseUrl.replace(/\/$/, "");

  // 1. WebSite — always present
  const websiteSchema = removeEmptyKeys({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrlClean}/#website`,
    name: siteTitle,
    description: config.site.description,
    url: baseUrl,
    inLanguage: lang || undefined,
  });

  // 2. Organization — always present, referenced by @id
  const organizationSchema = removeEmptyKeys({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrlClean}/#organization`,
    name: config.seo.author,
    url: baseUrl,
    sameAs: social.main.filter((item: any) => item.enable).map((item: any) => item.url),
    logo: { "@type": "ImageObject", url: absoluteUrl(config.site.logo, Astro) },
    streetAddress: orgData.streetAddress || undefined,
    addressLocality: orgData.addressLocality || undefined,
    addressRegion: orgData.addressRegion || undefined,
    email: orgData.email || undefined,
    telephone: orgData.telephone || undefined,
  });

  // 3. Page-specific schema
  let pageSchema: Record<string, any>;

  switch (pageType) {
    case "home":
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${baseUrlClean}/#localbusiness`,
        name: config.seo.author,
        description: description,
        url: baseUrl,
        image: image,
        telephone: orgData.telephone || undefined,
        email: orgData.email || undefined,
        address: (orgData.streetAddress || orgData.addressLocality || orgData.addressRegion) ? {
          "@type": "PostalAddress",
          streetAddress: orgData.streetAddress,
          addressLocality: orgData.addressLocality,
          addressRegion: orgData.addressRegion,
        } : undefined,
        sameAs: social.main.filter((item: any) => item.enable).map((item: any) => item.url),
      });
      break;

    case "service":
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: title,
        description: description,
        url: canonical,
        image: image || undefined,
        provider: { "@id": `${baseUrlClean}/#organization` },
        serviceType: serviceType || "Consulting Service",
        areaServed: { "@type": "State", name: orgData.addressRegion || "USA" },
      });
      break;

    case "blog-posting":
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${canonical}#blogposting`,
        headline: title,
        description: description,
        url: canonical,
        image: image || undefined,
        datePublished: datePublished || undefined,
        dateModified: dateModified || datePublished || undefined,
        author: { "@id": `${baseUrlClean}/#organization` },
        publisher: { "@id": `${baseUrlClean}/#organization` },
        mainEntityOfPage: canonical,
      });
      break;

    case "faq":
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${canonical}#faqpage`,
        mainEntity: faqItems
          ? faqItems.map((faq: any) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            }))
          : undefined,
      });
      break;

    case "contact":
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${canonical}#contactpage`,
        name: title,
        description: description,
        url: canonical,
        mainEntity: { "@id": `${baseUrlClean}/#organization` },
      });
      break;

    case "article":
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: title,
        description: description,
        url: canonical,
        image: image || undefined,
        datePublished: datePublished || undefined,
        dateModified: dateModified || datePublished || undefined,
        author: { "@id": `${baseUrlClean}/#organization` },
        publisher: { "@id": `${baseUrlClean}/#organization` },
      });
      break;

    default:
      pageSchema = removeEmptyKeys({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        name: title,
        description: description,
        url: canonical,
        image: image || undefined,
        inLanguage: lang || undefined,
      });
  }

  // Link page to WebSite via @id
  pageSchema.isPartOf = { "@id": `${baseUrlClean}/#website` };

  // Alternate languages
  if (alternateLangs.length > 0) {
    pageSchema.alternateLanguage = alternateLangs
      .filter((alt: any) => Astro.currentLocale !== alt.languageCode)
      .map((alt: any) => ({
        "@type": "WebPage",
        url: getLocaleUrlCTM(canonical, alt.languageCode),
        inLanguage: alt.languageCode,
      }));
  }

  // 4. BreadcrumbList — always present
  const breadcrumbSchema = generateBreadcrumb(canonical, title, baseUrl);

  // Return array for <Schema item={...}> from astro-seo-schema
  return [websiteSchema, organizationSchema, pageSchema, breadcrumbSchema];
}
