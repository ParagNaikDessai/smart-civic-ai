# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-20

### Added
- **Initial SaaS Portal Launch**: Built the landing page and core pages using only HTML5, CSS3, and JavaScript.
- **Rule-Based Routing Simulation**: Integrates rules inside [js/utils.js](js/utils.js) that route tickets to dedicated operations teams (e.g. Waste Management Team, Infrastructure Team, Water Services) and assign priority levels based on the user's selected category.
- **Dynamic Tracking Timeline**: Built a tracking view that renders progress indicators (Submitted, AI Analysis, Assigned, Processing, Resolved) and displays status logs and confirmation timestamps.
- **Coordinates Retriever**: Implemented location fetching using the browser standard HTML5 Geolocation API, populating inputs with latitude and longitude coordinates.
- **Evidence Preview & Base64 Converter**: Handles drag-and-drop file inputs, limits files to 2MB, and converts images to Base64 strings for simulated database persistence.
- **Toast Notifications**: Added a banner notification system (`Notification.show()`) that displays status and validation feedback to users.
- **Local Storage Database**: Saves complaints directly to `localStorage`, allowing users to test form submission and tracking offline.
- **SVG Graphics**: Created vector files for the portal logo and home page city illustration.
- **Accessibility features**: Added a skip link, keyboard control overrides, logical focus tabs, and WCAG AA color contrast elements.
- **Documentation**: Completed user guides, developer guides, installation files, and API maps in the root directory.

### Changed
- Refactored JS files to decouple data retrieval methods from UI DOM nodes, simplifying future integrations with n8n.
- Changed Google font imports to native system font stacks (`Segoe UI`, `Roboto`, `Helvetica`, `Arial`) to support full offline capabilities.
- Redesigned color palette from Government Blue to modern Monochrome Zinc to align with SaaS/tech branding visual designs.

### Security
- Created a [data security policy](pages/privacy.html) detailing geolocation privacy settings and explaining browser local storage bounds.
