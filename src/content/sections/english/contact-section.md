---
enable: true # Control the visibility of this section across all pages where it is used
badge: "General Questions"
title: "Frequently Asked Question."
backgroundImage: "/images/decorative/pattern/pattern-3.png"
backgroundImageAlt: "Contact Us"
decorativeImage: "/images/decorative/contact-person-2.png"
decorativeImageAlt: "Contact Us"

faqList:
  - enable: true
    title: "How to Change my Password easily?"
    content: |
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
  - enable: true
    title: "Tax Consultation for Business"
    content: |
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
  - enable: true
    title: "Best Tax & Financial Planning"
    content: |
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus

contactTitle: "Request A Call Back"
contactBadge: "Send A Message"

# Check config.toml file for form action related settings
# this is also used in the footer of the personal case studies homepage
form:
  emailSubject: "New form submission from taxo website" # Customized email subject (applicable when anyone submit form, form submission may receive by email depend on provider)
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
      placeholder: "Email Address *"
      name: "Email Address" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Subject *"
      name: "Subject" # This is crucial. Its indicate under which name you want to receive this field data
      required: false
      halfWidth: true
      dropdown:
        type: "" # select | search - default is select
        search: # if type is search then it will work
          placeholder: ""
        items:
          - label: "General Inquiry"
            value: "General Inquiry"
            selected: false
          - label: "Partnership Opportunity"
            value: "Partnership Opportunity"
            selected: false
          - label: "Investment Opportunity"
            value: "Investment Opportunity"
            selected: false
    - label: ""
      placeholder: "Subject With Search *"
      name: "Subject With Search" # This is crucial. Its indicate under which name you want to receive this field data
      required: false
      halfWidth: true
      dropdown:
        type: "search" # select | search - default is select
        search: # if type is search then it will work
          placeholder: "Subject With Search"
        items:
          - label: "General Inquiry"
            value: "General Inquiry"
            selected: false
          - label: "Partnership Opportunity"
            value: "Partnership Opportunity"
            selected: false
          - label: "Career Opportunity"
            value: "Career Opportunity"
            selected: false
          - label: "Investment Opportunity"
            value: "Investment Opportunity"
            selected: false
          - label: "Media Inquiry"
            value: "Media Inquiry"
            selected: false
    - label: ""
      tag: "textarea"
      defaultValue: ""
      rows: "2" # Only work if tag is textarea
      placeholder: "How can we help you *"
      name: "Message" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: false
    - label: "Google Search" # only valid for type="checkbox" & type === "radio"
      checked: false # only valid for type="checkbox" & type === "radio"
      name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      groupLabel: "How did you hear about us?" # Radio Inputs Label
      group: "source" # when you add group then it will omit space between the same group radio input
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Social Media" # only valid for type="checkbox" & type === "radio"
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
      content: Something went wrong! please use this mail - [taxo-astro-theme@gmail.com](mailto:taxo-astro-theme@gmail.com) to submit a ticket!
---
