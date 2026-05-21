---
enable: true # Control the visibility of this section across all pages where it is used
badge: "Contact rapide"
title: "Une question ? Parlons-en!"
description: "Car il ne méprise ni ne hait le plaisir en soi parce qu'il est plaisir, mais parce que de grandes souffrances s'ensuivent pour ceux qui raisonnent."
contactTitle: "Envoyer un message"
list:
  - title: "Vous avez une question?"
    icon: "/images/icons/svg/phone-call.svg"
    settingFieldName: "phone"
  - title: "Rédiger un e-mail"
    icon: "/images/icons/svg/email.svg"
    settingFieldName: "email"
  - title: "Visitez-nous à tout moment"
    icon: "/images/icons/svg/location.svg"
    settingFieldName: "address"

# Check config.toml file for form action related settings
# this is also used in the footer of the personal case studies homepage
form:
  emailSubject: "Nouvelle soumission de formulaire depuis le site taxo" # Customized email subject (applicable when anyone submit form, form submission may receive by email depend on provider)
  submitButton:
    # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
    enable: true
    label: "Envoyer un message"
    # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
    # variant: "" # Optional: fill | outline | text | circle
    # rel: "" # Optional
    # target: "" # Optional

  # This note will show at the end of form
  # note: |
  #   Your data is safe with us. We respect your privacy and never share your information. <br /> Read our [Privacy Policy](/privacy-policy/).
  inputs:
    - label: ""
      placeholder: "Nom complet *"
      name: "Full Name" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Adresse e-mail *"
      name: "Email Address" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      type: "email"
      halfWidth: true
      defaultValue: ""
    - label: ""
      placeholder: "Sujet *"
      name: "Subject" # This is crucial. Its indicate under which name you want to receive this field data
      required: false
      halfWidth: true
      dropdown:
        type: "" # select | search - default is select
        search: # if type is search then it will work
          placeholder: ""
        items:
          - label: "Demande générale"
            value: "Demande générale"
            selected: false
          - label: "Opportunité de partenariat"
            value: "Opportunité de partenariat"
            selected: false
          - label: "Opportunité d'investissement"
            value: "Opportunité d'investissement"
            selected: false
    - label: ""
      placeholder: "Sujet avec recherche *"
      name: "Subject With Search" # This is crucial. Its indicate under which name you want to receive this field data
      required: false
      halfWidth: true
      dropdown:
        type: "search" # select | search - default is select
        search: # if type is search then it will work
          placeholder: "Sujet avec recherche"
        items:
          - label: "Demande générale"
            value: "Demande générale"
            selected: false
          - label: "Opportunité de partenariat"
            value: "Opportunité de partenariat"
            selected: false
          - label: "Opportunité de carrière"
            value: "Opportunité de carrière"
            selected: false
          - label: "Opportunité d'investissement"
            value: "Opportunité d'investissement"
            selected: false
          - label: "Demande des médias"
            value: "Demande des médias"
            selected: false
    - label: ""
      tag: "textarea"
      defaultValue: ""
      rows: "2" # Only work if tag is textarea
      placeholder: "Comment pouvons-nous vous aider? *"
      name: "Message" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      halfWidth: false
    - label: "Recherche Google" # only valid for type="checkbox" & type === "radio"
      checked: false # only valid for type="checkbox" & type === "radio"
      name: "User Source" # This is crucial. Its indicate under which name you want to receive this field data
      required: true
      groupLabel: "Comment avez-vous entendu parler de nous?" # Radio Inputs Label
      group: "source" # when you add group then it will omit space between the same group radio input
      type: "radio"
      halfWidth: true
      defaultValue: ""
    - label: "Réseaux sociaux" # only valid for type="checkbox" & type === "radio"
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
    - label: "J'accepte les conditions générales et la [politique de confidentialité](/contact/)." # only valid for type="checkbox" & type === "radio"
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
      content: Nous avons bien reçu votre message ! Nous vous répondrons dans les plus brefs délais.
    - note: deprecated # info | warning | success | deprecated | hint
      parentClass: "hidden text-sm message error"
      content: Une erreur s'est produite ! Veuillez utiliser ce mail - [taxo-astro-theme@gmail.com](mailto:taxo-astro-theme@gmail.com) pour soumettre un ticket!
---
