export const SERVICE_CARD_LAYOUT = ["horizontal", "listImage"] as const;
export const CASESTUDIES_CARD_LAYOUT = ["card", "grid", "slider"] as const;
export const BLOG_CARD_LAYOUT = [
  "grid",
  "horizontal",
  "featured",
  "compact",
] as const;
export const FEATURED_GRID_CARD_LAYOUT = [
  "insideIcon",
  "outsideIcon",
  "outsideIconSquare",
] as const;
export type FeaturedGridCardLayout = (typeof FEATURED_GRID_CARD_LAYOUT)[number];

export const TESTIMONIAL_CARD_LAYOUT = ["card", "cardWithSign"] as const;
