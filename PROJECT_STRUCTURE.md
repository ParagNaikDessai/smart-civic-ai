# Project Structure Guide

This document provides a file-by-file breakdown of the **Smart Civic AI** repository, explaining the purpose of each directory and file.

---

## 📂 Codebase Layout

```
Smart-Civic-AI/
├── assets/
│   ├── images/      # SaaS analytics image resources
│   ├── icons/       # Actionable vector icons (SVG)
│   └── logo/        # Hexagonal tech-node logo (SVG)
├── css/
│   ├── style.css       # SaaS monochrome variables, layouts, and typography
│   ├── responsive.css  # Viewport adaptation media queries
│   └── animations.css  # Subtle micro-interaction keyframes
├── js/
│   ├── app.js       # Navigation controls & toast notification engine
│   ├── report.js    # GPS coordinates, uploader, & validations
│   ├── track.js     # Search validations & timeline rendering
│   └── utils.js     # Database adapter & config (WEBHOOK TOGGLE HERE)
├── pages/
│   ├── report.html  # Ticket submission form
│   ├── success.html # Ticket success receipt
│   ├── track.html   # Status tracking timeline
│   ├── about.html   # AI workflow map & UN SDG 11 metrics
│   ├── faq.html     # Collapsible Q&A accordion
│   └── privacy.html # Data security policies
├── index.html       # Product landing home page
```

---

## 📂 File-by-File Breakdown

### Root Directory
- [index.html](index.html): The landing page of the platform. It features a hero banner with CTA buttons, a UN SDG 11 section, and a "Pipeline" feature grid.
- [LICENSE](LICENSE): The MIT License terms for this open-source project.
- [.gitignore](.gitignore): Git ignore rules to prevent tracking temporary files, IDE folders, and local environment secrets.
- [robots.txt](robots.txt): Search engine crawler instructions, pointing indexers to the XML sitemap.
- [sitemap.xml](sitemap.xml): XML sitemap mapping the indexable HTML routes for SEO indexing.

### `assets/` Directory
- [assets/logo/logo.svg](assets/logo/logo.svg): Vector logo depicting a geometric hexagon overlayed with connection links. Used in headers and receipts.
- [assets/images/hero-city.png](assets/images/hero-city.png): Illustration representing a SaaS operational metrics dashboard, aligned with UN SDG 11. Used on the home landing page.

### `css/` Directory
- [css/style.css](css/style.css): Defines color palettes (monochrome zinc theme), typographic choices (system font stacks for offline capability), form elements, custom receipt cards, visual timelines, and sticky header/footer layouts.
- [css/responsive.css](css/responsive.css): Media queries that adjust styling layouts for mobile, tablet, and laptop viewports. It handles mobile hamburger toggle actions and drawer transitions.
- [css/animations.css](css/animations.css): Handles keyframe entry slide-ups, fades, and interactive button pulses. It includes styles that respect user accessibility configurations (`prefers-reduced-motion`).

### `js/` Directory
- [js/utils.js](js/utils.js): Centralized API module. It manages data access, geolocation coordinates, and local storage. By editing `API_CONFIG` in this file, you can switch the application from `localStorage` mode to `webhook` mode.
- [js/app.js](js/app.js): Global UI manager. Highlights active links, handles the mobile navigation drawer, manages keyboard accessibility (closing drawer on `Escape`), and provides a toast notification system.
- [js/report.js](js/report.js): Script for [pages/report.html](pages/report.html). Handles drag-and-drop file inputs, image thumbnail rendering, coordinate fetching via GPS, and client-side form validation before triggering submission routines.
- [js/track.js](js/track.js): Script for [pages/track.html](pages/track.html). Handles search input processing, deep-link URL parsing (e.g. `?id=SCAI-XXXX`), and updates the status timeline.

### `pages/` Directory
- [pages/report.html](pages/report.html): Page containing the complaint form. Users can select category types, write descriptions, specify locations, fetch GPS coordinates, and upload evidence images.
- [pages/success.html](pages/success.html): Landing page displayed upon successful submission. Displays case metadata (assigned ID, priority, routed department) and provides a print option.
- [pages/track.html](pages/track.html): Page that allows citizens to view the progress of a complaint. Renders an interactive timeline showing the resolution status.
- [pages/about.html](pages/about.html): General background about the Final Year Project, alignment with UN SDG 11 targets, and the system architecture workflow.
- [pages/faq.html](pages/faq.html): Accordion menu answering common citizen inquiries regarding tracking IDs, coordinates, and data safety.
- [pages/privacy.html](pages/privacy.html): Policies explaining data tracking limits, browser sandboxing, local database handling, and GPS permissions.
