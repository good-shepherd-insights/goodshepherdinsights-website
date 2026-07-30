import { sanityClient } from "./client";
import { cleanSanityValue } from "./clean";

export async function getSanityTeamMembers(limit?: number | false) {
  const members = await sanityClient.fetch<any[]>(
    `*[_type == "teamMember" && enable != false] | order(coalesce(order, 9999) asc, title asc){
      enable,
      title,
      image,
      profession,
      description,
      email,
      phone,
      social
    }`,
  );

  return cleanSanityValue(typeof limit === "number" ? members.slice(0, limit) : members);
}

export async function getSanityTestimonials(homeTwoVariant = false) {
  return cleanSanityValue(await sanityClient.fetch<any[]>(
    `*[_type == "testimonial" && enable != false && coalesce(homeTwoVariant, false) == $homeTwoVariant] | order(coalesce(order, 9999) asc){
      enable,
      content,
      platform,
      customer
    }`,
    { homeTwoVariant },
  ));
}
