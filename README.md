# Smart Civic AI

[![UN SDG 11 Aligned](https://img.shields.io/badge/UN%20SDG-11-E5243B.svg?style=flat-square)](https://sdgs.un.org/goals/goal11)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Platform: Vanilla Web](https://img.shields.io/badge/Platform-Vanilla--HTML5%2FCSS3%2FJS-blueviolet.svg?style=flat-square)](#technology-stack)
[![Accessibility: WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg?style=flat-square)](#accessibility)

An intelligent, lightweight, and fully responsive community issue management and tracking platform, built in alignment with **United Nations Sustainable Development Goal 11 (SDG 11: Sustainable Cities and Communities)**.

Designed for portfolios, startup demonstrations, and academic milestones, the frontend is built using native web languages (with simulated local storage databases) and can be connected directly to an **n8n workflow backend** by changing a single configuration key in `js/utils.js`.

---

## 🏛️ Project Overview

Traditional community complaint systems suffer from manual routing queues, leading to resolution delays and incorrect department assignment.

**Smart Civic AI** automates this triage pipeline:
1. **Logging**: Users submit issue tickets (e.g. broken streetlights, water leaks, sanitation tasks) with descriptive text, GPS coordinates, and evidence images.
2. **AI Classification**: In production, an AI Agent (like Gemini) evaluates the ticket to calculate severity ratings (Low, Medium, High) and assigns the issue to the matching operations team (e.g. Waste Management Team, Infrastructure Team).
3. **Tracking**: Users query a unique reference code to view real-time logs and resolution steps on a visual timeline.

---

## ⚡ Key Features

- **Automated AI Triaging Simulation**: Evaluates description text and assigns teams/severity ratings.
- **GPS Coordinates Retrieval**: Accesses device coordinates via HTML5 Geolocation API.
- **Base64 Evidence Upload**: Drag-and-drop file inputs, image previews, and local persistence.
- **Visual Timelines**: Renders progress nodes (Submitted, AI Analysis, Assigned, Processing, Resolved) and update logs dynamically.
- **Offline Capability**: Works without servers or external network calls using browser `localStorage` DB.
- **Premium SaaS Theme**: Monochrome Zinc design system (inspired by Vercel and Stripe) with clean transitions and responsive grids.
- **Accessibility & Contrast**: Built to meet WCAG AA standards. Features keyboard loops, skip-to-content links, and responsive timelines.

---

## 📂 Folder Structure

```
Smart-Civic-AI/
├── assets/
│   ├── images/      # SaaS analytics vector graphics (SVG)
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
├── robots.txt       # Crawler indexing rules
└── sitemap.xml      # SEO routes mapping
```

---

## 🚀 How to Run Locally

Since this portal is built using only standard web languages, it requires no compilation, installation commands, node packages, or server runtimes.

1. **Clone/Download the repository** to your local drive.
2. Open the main portal file:
   - Double-click [index.html](index.html) to run directly in any browser.
   - Alternatively, open the project directory in VS Code and use the **Live Server** extension.

---

## ⚙️ Future Backend Webhook Integration

The portal separates the user interface pages from the API data adapter code. All database connections and query operations are encapsulated inside [js/utils.js](js/utils.js).

To connect this frontend to your active **n8n automated workflow**:
1. Open the [js/utils.js](js/utils.js) file.
2. Update the `API_CONFIG` object:
   ```javascript
   const API_CONFIG = {
     mode: 'webhook', // Change 'localStorage' to 'webhook'
     webhookUrl: 'https://your-n8n-instance.com/webhook/civic-complaint', // Replace with your webhook URL
     storageKey: 'smart_civic_complaints'
   };
   ```
3. The pages will now automatically route all submissions and status queries to your n8n production hook using standard POST and GET payloads.

---

## 🛠️ Technology Stack

- **Structure**: HTML5 (Semantic landmarks, ARIA compliance)
- **Styling**: CSS3 Custom Variables (Zinc monochrome theme)
- **Scripting**: Vanilla ECMAScript 6+ (Asynchronous Fetch, LocalStorage DB)
- **Typography**: System Font Stacks (Segoe UI, Roboto, Helvetica, Arial, sans-serif) for offline accessibility
- **Graphics**: SVG Vectors (Hexagonal logo, network charts)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
