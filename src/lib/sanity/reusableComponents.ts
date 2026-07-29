import { sanityClient } from "./client";

export interface ReusableButton {
  enable: boolean;
  label: string;
  url: string;
  variant?: "fill" | "outline" | "text" | "circle" | "white";
  hoverEffect?:
    "text-flip" | "creative-fill" | "magnetic" | "magnetic-text-flip";
}

export interface ReusableCtaSection {
  enable: boolean;
  title?: string;
  description?: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  humanImage?: string;
  humanImageAlt?: string;
  button?: ReusableButton;
}

export async function getReusableCtaSection() {
  return sanityClient.fetch<ReusableCtaSection | null>(
    `*[_type == "reusableComponents" && _id == "reusable-components"][0].ctaSection{
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
    }`,
  );
}
