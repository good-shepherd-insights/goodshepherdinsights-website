export const SITE_ORIGIN = "https://goodshepherdinsights.com";

export type LivePageKind =
  | "home"
  | "standard"
  | "blogIndex"
  | "blogPost"
  | "servicesIndex"
  | "serviceDetail"
  | "contact"
  | "faq";

export type LivePageContract = {
  kind: LivePageKind;
  requiredSchemaTypes: string[];
  requiresBreadcrumb: boolean;
  primaryEntity?: {
    type: string;
    fragment: string;
  };
};

export function classifyLivePath(pathname: string): LivePageContract | undefined {
  if (pathname === "/") {
    return contract(
      "home",
      ["WebSite", "Organization", "WebPage", "LocalBusiness"],
      false,
      { type: "LocalBusiness", fragment: "localbusiness" },
    );
  }

  if (pathname === "/blog/") {
    return contract(
      "blogIndex",
      ["WebSite", "Organization", "WebPage", "CollectionPage", "ItemList"],
      true,
      { type: "ItemList", fragment: "itemlist" },
    );
  }

  if (/^\/blog\/[^/]+\/$/.test(pathname)) {
    return contract(
      "blogPost",
      ["WebSite", "Organization", "WebPage", "BlogPosting"],
      true,
      { type: "BlogPosting", fragment: "blogposting" },
    );
  }

  if (pathname === "/services/") {
    return contract(
      "servicesIndex",
      ["WebSite", "Organization", "WebPage", "CollectionPage", "ItemList"],
      true,
      { type: "ItemList", fragment: "itemlist" },
    );
  }

  if (/^\/services\/[^/]+\/$/.test(pathname)) {
    return contract(
      "serviceDetail",
      ["WebSite", "Organization", "WebPage", "Service"],
      true,
      { type: "Service", fragment: "service" },
    );
  }

  if (pathname === "/contact/") {
    return contract(
      "contact",
      ["WebSite", "Organization", "WebPage", "ContactPage"],
      true,
      { type: "ContactPage", fragment: "contactpage" },
    );
  }

  if (pathname === "/faq/") {
    return contract(
      "faq",
      ["WebSite", "Organization", "WebPage", "FAQPage"],
      true,
      { type: "FAQPage", fragment: "faqpage" },
    );
  }

  if (["/about/", "/privacy-policy/", "/terms-conditions/"].includes(pathname)) {
    return contract("standard", ["WebSite", "Organization", "WebPage"], true);
  }

  return undefined;
}

export function isIgnoredGeneratedPath(pathname: string) {
  return (
    pathname === "/404" ||
    pathname === "/case-studies/" ||
    /^\/case-studies\/[^/]+\/$/.test(pathname) ||
    /^\/blog\/page\/[^/]+\/$/.test(pathname) ||
    /^\/blog\/(?:category|tag)\/[^/]+\/$/.test(pathname)
  );
}

function contract(
  kind: LivePageKind,
  requiredSchemaTypes: string[],
  requiresBreadcrumb: boolean,
  primaryEntity?: LivePageContract["primaryEntity"],
): LivePageContract {
  return { kind, requiredSchemaTypes, requiresBreadcrumb, primaryEntity };
}
