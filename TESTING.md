# Testing Documentation

This document outlines the testing procedures and validation matrices for the **Smart Civic AI** frontend platform.

---

## 🧪 1. Validation Testing (Form Inputs)

Form inputs are validated on the client side inside [js/report.js](js/report.js) before submission.

### Validation Test Cases:

| Field | Input Test Case | Expected Behavior | Status |
|---|---|---|---|
| **Title** | Empty / Blank | Displays "Please provide a descriptive title..." | Pass |
| **Title** | Less than 5 characters (e.g. *"Lamp"*) | Displays "Please provide a descriptive title (at least 5 characters)." | Pass |
| **Category** | No option selected | Displays "Please select a category." | Pass |
| **Description** | Empty / Blank | Displays "Please describe the issue in detail..." | Pass |
| **Description** | Less than 15 characters (e.g. *"Water leak"*) | Displays "Please describe the issue in detail (at least 15 characters)." | Pass |
| **Location** | Empty / Blank | Displays "Please specify the location/address details..." | Pass |
| **Location** | Less than 5 characters | Displays "Please specify the location/address details (at least 5 characters)." | Pass |
| **Latitude** | Invalid decimals (e.g. *"12abc"* or *"12"*) | Displays "Latitude must be in decimal form (e.g. 12.345678)." | Pass |
| **Longitude** | Invalid decimals (e.g. *"77.1"* or *"77.123"*) | Displays "Longitude must be in decimal form (e.g. 77.345678)." | Pass |
| **Image Upload** | Non-image file types (e.g. `.pdf`, `.zip`) | Shows error toast "Only image files are allowed." | Pass |
| **Image Upload** | Image file larger than 2MB | Shows error toast "Image size exceeds 2MB limit." | Pass |

---

## 📱 2. Responsive Viewport Testing

The application uses media queries inside [css/responsive.css](css/responsive.css) to support multiple screen dimensions.

### Viewport Targets:

- **Desktop (Laptops/Monitors - `1024px` and above)**:
  - Navigation links displayed inline in the header.
  - Side-by-side hero layout.
  - Cards rendered in a multi-column grid.
  - Horizontal progress timeline for tracking.

- **Tablet (e.g., iPad - `769px` to `1023px`)**:
  - Main containers adapt to `90vw`.
  - Hero image moves above content if width is under `900px`.
  - Grid structures transition to 2 columns.

- **Mobile Landscape & Small Tablets (`481px` to `768px`)**:
  - Inline navigation collapses; mobile menu hamburger toggle is shown.
  - Clicking toggle opens a sliding drawer menu.
  - Horizontal progress timeline converts to a vertical step layout.

- **Mobile Portrait (Smartphones - `480px` and below)**:
  - Form field rows stack vertically.
  - Form action buttons (Submit, Reset) span 100% width.
  - Header badge hides to maximize brand name space.

---

## 🌐 3. Browser Compatibility

The application is written in standard web languages and is compatible with modern browsers:

- **Google Chrome** (v80+)
- **Mozilla Firefox** (v75+)
- **Microsoft Edge** (v80+)
- **Apple Safari** (v13+)
- **Opera** (v67+)

---

## ♿ 4. Accessibility (WCAG 2.1 AA Checklist)

- **Semantic HTML**: Tested using semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`).
- **Keyboard Navigation**: Pressing `Tab` cycles through links and interactive buttons in logical order. Focused elements display an outline.
- **Skip Link**: The "Skip to main content" link appears on first tab, allowing keyboard users to bypass navigation.
- **Color Contrast**: Main primary dark text (`#09090b`) on white background provides a contrast ratio exceeding the WCAG AA requirement of `4.5:1` for text.
