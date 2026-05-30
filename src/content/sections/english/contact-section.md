---
enable: true # Control the visibility of this section across all pages where it is used
badge: "Common Questions"
title: "Frequently asked questions."
backgroundImage: "/images/decorative/pattern/pattern-3.png"
backgroundImageAlt: "Contact Us"
decorativeImage: "/images/decorative/contact-person-2.png"
decorativeImageAlt: "Contact Us"

faqList:
  - enable: true
    title: "How do we choose the right ChMS for our church?"
    content: |
      We evaluate your current systems, ministry workflows, and growth trajectory to recommend a ChMS that fits your congregation — not the other way around.
  - enable: true
    title: "What does a Fractional CTO engagement look like?"
    content: |
      We provide ongoing strategic technology leadership on a part-time basis, helping you make vendor decisions, plan upgrades, and keep your data secure without the cost of a full-time hire.
  - enable: true
    title: "How can we reduce the number of disconnected tools we use?"
    content: |
      Most churches we work with are running 5–8 disconnected tools. We help you consolidate and integrate so your staff can focus on ministry instead of data entry.

contactTitle: "Request A Call Back"
contactBadge: "Send A Message"

# Check config.toml file for form action related settings
# this is also used in the footer of the personal case studies homepage
form:
  emailSubject: "New form submission from GSI website" # Customized email subject (applicable when anyone submit form, form submission may receive by email depend on provider)
  submitButton:
    # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
    enable: true
    label: "Send A Message"
    # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
    # variant: "" # Optional: fill | outline | text | circle
    # rel: "" # Optional
    # target: "" # Optional

  # This note will show at the end of form
  # note: |
  #   Your data is safe with us. We respect your privacy and never share your information. <br /> Read our [Privacy Policy](/privacy-policy/).
  inputs:
    - label: ""
      placeholder: "Full Name *"
      name: "Full Name" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Church Email Address *"
      name: "Email Address" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Current Church Size (Attendees) *"
      name: "Subject" # This is crucial. Its indicate under which name you want to receive this field data
      required: false
      halfWidth: true
      dropdown:
        type: "" # select | search - default is select
        search: # if type is search then it will work
          placeholder: ""
        items:
          - label: "Under 200"
            value: "Under 200"
            selected: false
          - label: "200 - 500"
            value: "200-500"
            selected: false
          - label: "500 - 1,000"
            value: "500-1000"
            selected: false
          - label: "1,000 - 2,000"
            value: "1000-2000"
            selected: false
          - label: "2,000+"
            value: "2000+"
            selected: false
    - label: ""
      placeholder: "Primary Technology Challenge *"
      name: "Subject With Search" # This is crucial. Its indicate under which name you want to receive this field data
      required: false
      halfWidth: true
      dropdown:
        type: "search" # select | search - default is search
        search: # if type is search then it will work
          placeholder: "Primary Technology Challenge"
        items:
          - label: "ChMS Issues"
            value: "ChMS"
            selected: false
          - label: "Data Security"
            value: "Security"
            selected: false
          - label: "System Integration"
            value: "Integration"
            selected: false
          - label: "Staff Burnout"
            value: "Burnout"
            selected: false
          - label: "Vendor Management"
            value: "Vendors"
            selected: false
    - label: ""
      tag: "textarea"
      defaultValue: ""
      rows: "2" # Only work if tag is textarea
      placeholder: "How can we help you *"
      name: "Message" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: false
    - label: "Personal Referral" # only valid for type="checkbox" & type === "radio"
      checked: false # only valid for type="checkbox" & type === "radio"
      name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      groupLabel: "How did you hear about us?" # Radio Inputs Label
      group: "source" # when you add group then it will omit space between the same group radio input
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Event or Conference" # only valid for type="checkbox" & type === "radio"
      name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      groupLabel: "" # Radio Inputs Label
      group: "source" # when you add group then it will omit space between the same group radio input
      type: "radio"
      halfWidth: true
      defaultValue: ""
    # - label: "Referral" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    # - label: "Other" # only valid for type="checkbox" & type === "radio"
    #   name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
    #   required: true
    #   groupLabel: "" # Radio Inputs Label
    #   group: "source" # when you add group then it will omit space between the same group radio input
    #   type: "radio"
    #   halfWidth: true
    #   defaultValue: ""
    - label: "I agree to the terms and conditions and [privacy policy](/contact/)." # only valid for type="checkbox" & type === "radio"
      id: "privacy-policy"
      name: "Agreed Privacy" # This is crucial. Its indicate under which name you want to receive this field data
      value: "Agreed" # Value that will be submit (applicable for type="checkbox" & type === "radio")
      checked: false # only valid for type="checkbox" & type === "radio"
      required: true
      type: "checkbox"
      halfWidth: false
      defaultValue: ""
    - note: success # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message success"
      content: We have received your message! We'll get back to you as soon as possible.
    - note: deprecated # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message error"
      content: Something went wrong! Please email us directly at [info@goodshepherdinsights.com](mailto:info@goodshepherdinsights.com) to submit a ticket!
---
