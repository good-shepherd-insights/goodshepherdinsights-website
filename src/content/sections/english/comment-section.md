---
enable: true
title: "Leave a comment"

form:
  emailSubject: "New Blog Comment"

  submitButton:
    enable: true
    label: "Post Comment"

  inputs:
    - label: "Name"
      placeholder: "Name"
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

    - label: "Subject"
      placeholder: "Subject (Optional)"
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
