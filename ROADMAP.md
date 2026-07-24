# Project Roadmap & Future Milestones

This roadmap outlines the planned development phases to transition **Smart Civic AI** from a static frontend template to a production-grade, enterprise-scale community management utility.

---

## 📅 Development Phases

```mermaid
gantt
    title Smart Civic AI Roadmap
    dateFormat  YYYY-MM
    section Phase 1: Frontend
    UI Design & Validation      :active, p1_1, 2026-07, 1M
    Offline Storage Mocking     :active, p1_2, 2026-07, 1M
    section Phase 2: Integration
    n8n Webhook Hookup          :todo, p2_1, 2026-08, 1M
    Gemini AI Triaging          :todo, p2_2, 2026-08, 1M
    Google Sheets Log DB        :todo, p2_3, 2026-08, 1M
    section Phase 3: Advanced
    GIS Map Integration         :todo, p3_1, 2026-09, 2M
    User Auth Portal            :todo, p3_2, 2026-10, 2M
    Operations Admin Dashboard  :todo, p3_3, 2026-11, 2M
```

---

## 🚀 Future Feature Breakdown

### Phase 2: Integration & Automations (Short-Term)
- **n8n Webhook Endpoint**: Switch `API_CONFIG.mode` to webhook mode to route real-time HTTP payloads.
- **Gemini Triage Node**: Configure a prompt on the Gemini AI node in n8n to classify complaints and assign priority.
- **Email Notifications**: Trigger automatic citizen status update mailers using SMTP, SendGrid, or Gmail nodes.
- **Google Sheets Logger**: Log all submitted issues to a central spreadsheet.

### Phase 3: Advanced Features (Medium-Term)
- **Interactive Map Overlay**:
  - Integrate a lightweight, open-source library like **Leaflet.js** (no React/Node required) to display reported issues on an interactive map.
  - Render color-coded location pins based on priority (Red = High, Yellow = Medium, Gray = Resolved).
- **User Authentication**:
  - Implement a passwordless login system (via n8n email/SMS OTP codes) to allow community members to view all their submitted tickets on a single personal dashboard.
- **Dark Mode Support**:
  - Define CSS custom variables for a dark theme (e.g. `--color-bg-light: #09090b`, `--color-bg-card: #18181b`, `--color-text-dark: #fafafa`, `--color-border: #27272a`).
  - Toggle themes based on system preferences (`prefers-color-scheme`) or a header button.

### Phase 4: Administrative Dashboard (Long-Term)
- **Operations Portal**:
  - Build a secure login page for operations managers and team leads.
  - Enable staff to view incoming tickets, update resolution status (e.g. change status from `routed` to `progress`), and log resolution notes.
- **Analytics & Dashboard Widgets**:
  - Visualize resolution rates, average turnaround times, and common issue categories using clean charts.
  - Help team leads identify bottleneck areas to support long-term resource planning.
