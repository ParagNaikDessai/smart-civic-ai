# API Integration Guide

This document details the API schemas and endpoint behaviors required to connect the **Smart Civic AI** frontend to a live **n8n automated workflow**.

---

## ⚡ Data Flow Architecture

The data module [js/utils.js](js/utils.js) abstracts all API operations. When the integration configuration is toggled to webhook mode, the platform communicates with the backend via standard `fetch` HTTP requests:

```
[ Frontend Client ] ──( HTTP POST / GET )──> [ n8n Webhook Node ] ──> [ Gemini AI / Google Sheets ]
```

---

## 📥 1. Ticket Submission Endpoint

- **Method**: `POST`
- **Path**: `${API_CONFIG.webhookUrl}`
- **Headers**:
  - `Content-Type`: `application/json`

### Request Payload Format
```json
{
  "title": "Clogged storm drain near park",
  "category": "water",
  "description": "The storm drain at the intersection of Main Street and 4th Avenue is completely blocked with leaves and plastic bottles. Water is pooling on the street.",
  "location": "Main St & 4th Ave Intersection",
  "latitude": "12.971598",
  "longitude": "77.594562",
  "image": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```

### Expected Response Format
The backend should return a JSON response with status code `200 OK` or `201 Created`, containing the triaged and prioritized ticket metadata:

```json
{
  "id": "SCAI-2026-7782",
  "title": "Clogged storm drain near park",
  "category": "water",
  "department": "Water Services",
  "priority": "High",
  "location": "Main St & 4th Ave Intersection",
  "latitude": "12.971598",
  "longitude": "77.594562",
  "status": "submitted",
  "aiSummary": "Blockage detected in drainage pipes. Automated triage routed ticket to Water Services team.",
  "createdAt": "2026-07-20T17:47:28.000Z",
  "statusTimeline": [
    {
      "status": "submitted",
      "date": "2026-07-20T17:47:28.000Z",
      "note": "Report logged via Webhook."
    },
    {
      "status": "review",
      "date": "2026-07-20T17:47:30.000Z",
      "note": "AI Triaged Category: WATER. Routed to Water Services."
    }
  ]
}
```

---

## 🔍 2. Ticket Tracking Endpoint

- **Method**: `GET`
- **Path**: `${API_CONFIG.webhookUrl}/track`
- **Query Parameters**:
  - `id`: Unique Reference ID (e.g. `SCAI-2026-7782`)

### Expected Response Format
The backend should search the Google Sheets database (or equivalent log) and return the case details, including any progress timeline history updates.

```json
{
  "id": "SCAI-2026-7782",
  "title": "Clogged storm drain near park",
  "category": "water",
  "department": "Water Services",
  "priority": "High",
  "location": "Main St & 4th Ave Intersection",
  "latitude": "12.971598",
  "longitude": "77.594562",
  "image": "data:image/png;base64,iVBORw0KGgoAAA...",
  "status": "progress",
  "aiSummary": "Blockage detected in drainage pipes. Automated triage routed ticket to Water Services team.",
  "createdAt": "2026-07-20T17:47:28.000Z",
  "statusTimeline": [
    { "status": "submitted", "date": "2026-07-20T17:47:28.000Z", "note": "Report logged via Webhook." },
    { "status": "review", "date": "2026-07-20T17:47:30.000Z", "note": "AI Triaged Category: WATER. Routed to Water Services." },
    { "status": "routed", "date": "2026-07-20T18:30:00.000Z", "note": "Assigned to Water Services Dispatch Division." },
    { "status": "progress", "date": "2026-07-21T09:00:00.000Z", "note": "Operations team dispatched. Clearing debris from drain." }
  ]
}
```

---

## ⚠️ 3. Error Handling

The frontend expects standard HTTP status codes to handle errors gracefully:

- **`400 Bad Request`**: Returned if required payload fields (title, category, description, location) are missing or invalid.
- **`404 Not Found`**: Returned if the queried Reference ID is not found in the database.
- **`500 Internal Server Error`**: Returned if the backend workflow encounters an unexpected error.

### Error Response Schema
```json
{
  "error": "Ticket Reference ID not found. Verify the reference code and try again."
}
```

---

## 🔒 4. CORS (Cross-Origin Resource Sharing)

Since the frontend may be hosted on a separate domain (e.g. GitHub Pages or Netlify) from the n8n backend, ensure the n8n Webhook node is configured to allow Cross-Origin requests:

1. In your **n8n Webhook Node Settings**, click **Add Option** > **Response Headers**.
2. Add the following headers:
   - `Access-Control-Allow-Origin`: `*` (or your specific frontend domain)
   - `Access-Control-Allow-Methods`: `GET, POST, OPTIONS`
   - `Access-Control-Allow-Headers`: `Content-Type, Authorization, Accept`
