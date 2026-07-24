# Contributing Guidelines

Thank you for your interest in contributing to **Smart Civic AI**. We welcome contributions from developers, designers, and documentation writers to help make our settlements more sustainable (SDG 11).

---

## 🚦 How to Contribute

### 1. Reporting Issues
- Search existing issues to ensure the ticket hasn't been logged yet.
- Open a new issue, describing the bug, steps to reproduce it, and your environment (browser and version).

### 2. Suggesting Enhancements
- Open an issue explaining your proposed enhancement and its benefits.
- Discuss options with the core maintainers.

### 3. Pull Request (PR) Workflow
- Fork the repository and create a new branch from `main`:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Make your code changes, ensuring they comply with our styling and coding guidelines (see below).
- Commit your changes with clear, descriptive messages:
  ```bash
  git commit -m "feat: add Leaflet.js interactive maps to track page"
  ```
- Push to your branch:
  ```bash
  git push origin feature/your-feature-name
  ```
- Open a Pull Request against the `main` branch.

---

## 🛠_ Development Guidelines

### Coding Standards:
- Use only native web technologies: **HTML5, CSS3, and Vanilla JavaScript (ES6+)**. Do not add external frameworks (React, Vue, Node, etc.).
- Ensure all pages are accessible, aiming to meet **WCAG 2.1 Level AA** compliance.
- Keep the design clean and professional, matching the established SaaS/Linear visual style.
- Use system font stacks (`system-ui, -apple-system, Segoe UI, Roboto`) to support full offline capabilities.
- Write clean, commented, and self-documenting code.

### File Structure:
- Pages should be created inside the `pages/` directory.
- CSS styling should be placed in `css/style.css` (or `css/responsive.css` for media queries).
- Page-specific JS logic should be separated from database helpers and API adapters. Place page scripts in `js/` (e.g. `js/report.js`) and API modules in `js/utils.js`.
- Always update [CHANGELOG.md](CHANGELOG.md) to log your changes.
