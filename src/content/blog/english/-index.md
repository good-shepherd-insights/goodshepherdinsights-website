---
badge: "Blog & News"
title: "Check our inside news & update"
metaDescription: "This is a example description"
draft: false

searchSection:
  title: "Check our inside News"
  searchPlaceholder: "Search in blog"
  button:
    tag: "button"
    # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options
    # (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
    enable: true
    label: ""
    # url: "/"
    icon: # Optional
      enable: true
      name: "Search" # Optional
      position: "right" # Optional: left | right
    variant: "fill" # Optional: fill | outline | text | circle | white
    # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
    # rel: "" # Optional
    # target: "" # Optional
# Settings of blog list page layout
options:
  search: true
  layout: "grid" # creative | grid
  columns: 2 # 1 / 2 / 3
---
