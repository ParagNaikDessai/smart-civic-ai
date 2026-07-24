# Developer Guide

Welcome to the developer documentation for the **Smart Civic AI** platform. This guide is written for frontend developers maintaining, extending, or integrating the portal.

---

## 🏛_ Code Architecture & Standards

This project is built using only native web technologies: **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. It does not use bundlers (Webpack, Vite), preprocessors (SASS), or runtime engines (Node.js).

### Coding Guidelines:
1. **Semantic HTML**: Keep structure clean and accessible. Always declare `aria-*` tags on custom components, specify `alt` texts on images, and use correct heading hierarchical patterns (`h1` down to `h6`).
2. **Modular CSS**:
   - `css/style.css` contains the design system (CSS variables, layout frameworks, grid definitions, cards, custom headers, footers).
   - `css/responsive.css` manages media query breakpoints. Avoid placing desktop styling changes here.
   - `css/animations.css` manages animation triggers. Ensure animations respect accessibility settings: `@media (prefers-reduced-motion: reduce)`.
3. **Vanilla JS Modules**:
   - Write clean, asynchronous code. Avoid writing global variables; scope variables within page-specific DOM loaders.
   - Do not import external packages or CDNs (such as jQuery) to keep the project lightweight.
4. **Offline Capability**: Use standard system font stacks (no Google Fonts) to allow the app to run fully offline.

---

## 🏷_ Naming Conventions

- **HTML/CSS Class Naming**: Use kebab-case for CSS classes (e.g. `.form-container`, `.btn-primary`, `.timeline-progress`).
- **IDs**: Use kebab-case for DOM landmarks (e.g. `#main-content`, `#menu-toggle`, `#report-form`).
- **JavaScript Variables**: Use camelCase for variables and function names (e.g. `submitComplaint`, `currentTimestamp`, `base64Image`).
- **JS Constants/Config**: Use UPPER_SNAKE_CASE for configurations and static dictionaries (e.g. `API_CONFIG`, `AI_ROUTING_RULES`).

---

## 📂 Project Structure Purpose

Refer to [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for a detailed file-by-file breakdown.

---

## 🔌 Integrating the n8n Workflow Backend

The application is structured to decouple UI pages from data adapters. All API calls route through the wrapper interface in [js/utils.js](js/utils.js).

### Step-by-Step Backend Integration:
1. Set the database configuration in `js/utils.js` to webhook mode:
   ```javascript
   const API_CONFIG = {
     mode: 'webhook',
     webhookUrl: 'https://paragdesai.app.n8n.cloud/webhook/civic-complaint',
     storageKey: 'smart_civic_complaints'
   };
   ```
2. In webhook mode, `API.submitComplaint(payload)` sends a `POST` request to the configured `webhookUrl`. The request body contains:
   ```json
   {
     "title": "String",
     "category": "String (waste|road|water|streetlight|safety|other)",
     "description": "String",
     "location": "String",
     "latitude": "String | null",
     "longitude": "String | null",
     "image": "Base64 String | null"
   }
   ```
3. Ensure your n8n workflow returns a matching response payload:
   ```json
   {
     "id": "SCAI-2026-XXXX",
     "title": "String",
     "category": "String",
     "department": "String (e.g., Waste Management Team)",
     "priority": "String (Low|Medium|High)",
     "location": "String",
     "latitude": "String",
     "longitude": "String",
     "status": "submitted",
     "aiSummary": "String (AI triage description summary)",
     "createdAt": "ISO Timestamp",
     "statusTimeline": [
       { "status": "submitted", "date": "ISO Timestamp", "note": "Log note" }
     ]
   }
   ```
4. Querying a ticket status sends a `GET` request to `${API_CONFIG.webhookUrl}/track?id=${id}`. Ensure the n8n endpoint handles this route and queries the Google Sheets log, returning the matching JSON row.
