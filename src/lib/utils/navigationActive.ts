import type { ChildNavigationLink, NavigationLink } from "@/types";
import { getLocaleUrlCTM } from "@/lib/utils/i18nUtils";
import config from "../../../.astro/config.generated.json";

type NavItem = NavigationLink | ChildNavigationLink;

const normalizePath = (value: string): string => {
  const path = value.split("?")[0]?.split("#")[0] || "/";
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
};

const toInternalPath = (
  url: string | undefined,
  locale: string | undefined,
): string | null => {
  if (!url) return null;
  const localized = getLocaleUrlCTM(url, locale);
  try {
    const baseUrl = new URL(config.site.baseUrl);
    const parsedUrl = new URL(localized, baseUrl);
    const isExternal =
      parsedUrl.origin !== baseUrl.origin &&
      parsedUrl.hostname !== "localhost" &&
      parsedUrl.hostname !== "127.0.0.1";
    if (isExternal) return null;
    return normalizePath(parsedUrl.pathname);
  } catch {
    return null;
  }
};

export const isActiveUrl = (
  url: string | undefined,
  currentPath: string,
  locale: string | undefined,
): boolean => {
  const targetPath = toInternalPath(url, locale);
  if (!targetPath) return false;
  return normalizePath(currentPath) === targetPath;
};

const isEnabled = (item: NavItem | undefined): boolean =>
  item?.enable !== false;

export const isActiveMenu = (
  menu: NavItem,
  currentPath: string,
  locale: string | undefined,
): boolean => {
  if (!isEnabled(menu)) return false;
  if (isActiveUrl(menu.url, currentPath, locale)) return true;

  if (
    menu.children?.some((child) => isActiveMenu(child, currentPath, locale))
  ) {
    return true;
  }

  const megaMenus = (menu as NavigationLink).menus;
  if (megaMenus?.some((mega) => isActiveMenu(mega, currentPath, locale))) {
    return true;
  }

  return false;
};
