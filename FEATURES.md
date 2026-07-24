# Feature Matrix & Functional Specifications

This document outlines the features and functional specifications of the **Smart Civic AI** community management platform.

---

## 🧭 1. General Interface Features

- **Monochrome Zinc Design**: Premium, minimalist layout (inspired by Stripe and Vercel) with clean typography, rounded cards, and light borders.
- **Sticky Navigation**: A header navigation menu that stays pinned at the top of the screen during scrolling.
- **Mobile Menu Drawer**: Collapses the navigation menu into a hamburger icon on mobile viewports (< 768px). Clicking the icon opens a drawer from the right.
- **Floating Toasts**: Visual toast notifications that display success messages, error details, and loading status in the bottom right of the screen.

---

## 📝 2. Ticket Reporting Features

- **Automatic Rule-Based AI Routing**: Automatically triages reports, routing them to the correct operational team and assigning a priority level based on the selected category:
  - **Waste Management** ➔ routed to *Waste Management Team* (Priority: Medium)
  - **Infrastructure Group** ➔ routed to *Infrastructure Team* (Priority: High)
  - **Water Services** ➔ routed to *Water Services* (Priority: High)
  - **Road Maintenance** ➔ routed to *Road Maintenance* (Priority: Medium)
  - **Public Safety** ➔ routed to *Public Safety Team* (Priority: High)
  - **Others** ➔ routed to *Operations Team* (Priority: Low)
- **HTML5 Geolocation**: Accesses device coordinates (latitude and longitude) with a single click, allowing field crews to locate the issue.
- **Drag-and-Drop Image Uploader**: Allows users to upload evidence photos by dragging files into the dropzone or browsing. Displays a preview image of the upload.
- **Client-Side Form Validation**:
  - Requires title (min 5 chars), category, description (min 15 chars), and landmark location (min 5 chars).
  - Validates coordinate decimal patterns.
  - Limits file uploads to images only, with a maximum file size of 2MB.

---

## 🔍 3. Tracking Features

- **Search by Reference ID**: Retrieves and displays complaint records by entering the unique reference code (e.g. `SCAI-2026-9081`).
- **Dynamic Progress Timeline**: Displays complaint status on a five-step timeline:
  1. **Submitted**: Receipt confirmed.
  2. **AI Analysis**: AI triaged and categorized the issue.
  3. **Assigned**: Routed to the operations team.
  4. **Processing**: Maintenance scheduled or dispatched.
  5. **Resolved**: Repairs completed.
- **Dynamic Log Updates**: Displays resolution logs, notes, and dates for each step in the timeline.
- **Deep-linking (URL Parameters)**: Allows direct navigation to a complaint using URL query parameters (e.g. `track.html?id=SCAI-2026-9081`). Used to transition from the success page to the tracking page.

---

## 🌍 4. UN SDG 11 Alignment Metrics

This project supports **UN SDG 11: Sustainable Cities and Communities** targets by automating public settlements infrastructure reporting:

- **Target 11.6 (Environmental Impact)**: Reduces waste accumulation through rapid routing to the Waste Management Team.
- **Target 11.2 (Road Safety)**: Helps identify road hazards (e.g., potholes, broken sidewalks) for faster repair dispatch by the Infrastructure Team.
- **Target 11.7 (Inclusive Public Spaces)**: Helps maintain streetlights and resolve public safety hazards to keep communities safe.
