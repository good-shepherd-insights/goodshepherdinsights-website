---
enable: true
title: "Laisser un commentaire"

form:
  emailSubject: "Nouveau commentaire du blog"

  submitButton:
    enable: true
    label: "Publier le commentaire"

  inputs:
    - label: "Nom"
      placeholder: "Nom"
      name: "name"
      type: "text"
      required: true
      halfWidth: true

    - label: "Email"
      placeholder: "Email"
      name: "email"
      type: "email"
      required: true
      halfWidth: true

    - label: "Sujet"
      placeholder: "Sujet (Optionnel)"
      name: "subject"
      type: "text"
      halfWidth: false

    - label: "Message"
      placeholder: "Message"
      name: "message"
      tag: "textarea"
      rows: "3"
      required: true
      halfWidth: false
---
