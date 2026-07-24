# Security Policy

We take the security of community data and operational systems seriously. This document outlines our security policies, supported versions, and vulnerability reporting procedures.

---

## 🛡️ Supported Versions

We actively support the following versions of the platform:

| Version | Supported |
|---|---|
| **v1.0.x** | Yes (Active) |
| **< v1.0.0** | No |

---

## 🔒 Security Practices

1. **Client-Side Storage**: In default mode, all data (coordinates, descriptions, images) is saved in the browser's `localStorage` sandbox and is not transmitted to external servers, protecting user privacy.
2. **Secure HTTPS Protocol**: When toggled to webhook mode, the portal uses secure HTTPS connections to transmit JSON payloads to your n8n workflow. Ensure your n8n instance uses SSL/TLS certificates.
3. **Input Sanitization**: In production, ensure your n8n workflow or backend database (Google Sheets/PostgreSQL) sanitizes incoming strings to prevent SQL Injection, Cross-Site Scripting (XSS), or injection attacks.
4. **Offline Capability**: Using system font stacks eliminates dependency on external CDNs (like Google Fonts or FontAwesome), protecting users against CDN poisoning or man-in-the-middle attacks.

---

## ✉️ Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. **Do not** open a public issue on GitHub.
2. Send an email to the security desk: **security@smart-civic-ai.gov.in**.
3. Include a detailed description of the vulnerability, steps to reproduce it, and a proof-of-concept if possible.
4. We will respond within 48 hours to acknowledge receipt and coordinate a patch release.
