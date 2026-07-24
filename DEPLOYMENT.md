# Deployment Guide

This guide details the deployment of the **Smart Civic AI** portal in both staging and production environments, including configuring CORS for n8n integrations.

---

## 🌐 1. Deploying the Frontend (Static Hosting)

The frontend contains static files only and can be deployed to any static host:

### Option A: GitHub Pages
1. Push your repository to GitHub.
2. In the repository settings, go to **Settings** > **Pages**.
3. Under "Build and deployment", set the source branch to `main` and folder to `/(root)`.
4. Click **Save**. The platform will be live at `https://your-username.github.io/repository-name/`.

### Option B: Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Drag and drop the `Smart-Civic-AI` root folder into the Netlify manual deploy container.
3. The folder will deploy in seconds and generate a custom URL (e.g., `https://smart-civic-ai.netlify.app`).

---

## 🔌 2. Configuring n8n Production Webhooks

To connect the frontend to a live backend:

1. Deploy the n8n workflow using the schemas defined in [API_INTEGRATION.md](API_INTEGRATION.md).
2. Set the `Webhook` node settings inside n8n:
   - **HTTP Method**: `POST`
   - **Path**: `civic-complaint`
   - **Response Mode**: `On Received` or `Last Node`
3. Edit the [js/utils.js](js/utils.js#L11-L15) file on the frontend to set mode and webhook URL:
   ```javascript
   const API_CONFIG = {
     mode: 'webhook',
     webhookUrl: 'https://paragdesai.app.n8n.cloud/webhook/civic-complaint',
     storageKey: 'smart_civic_complaints'
   };
   ```
4. Deploy the updated frontend code.

---

## 🔒 3. CORS Configuration (Important)

If your frontend is hosted on Netlify (e.g., `https://smart-civic.netlify.app`) and your n8n backend is hosted elsewhere (e.g., `https://n8n.yourdomain.com`), browsers will block requests unless **CORS** is configured on the backend.

### How to configure CORS in n8n:
1. Open your n8n workflow and click on your **Webhook Node** settings.
2. Under **Options**, click **Add Option** and select **Response Headers**.
3. Set the following header values:
   - `Access-Control-Allow-Origin`: `https://smart-civic.netlify.app` (or `*` to allow all domains)
   - `Access-Control-Allow-Methods`: `GET, POST, OPTIONS`
   - `Access-Control-Allow-Headers`: `Content-Type, Accept, Authorization`
4. Save the workflow changes.

---

## 📋 4. Production Release Checklist

Before launching the platform publicly, complete these verification steps:

- [ ] Change the API mode to `webhook` inside [js/utils.js](js/utils.js) and verify that the n8n connection URL is correct.
- [ ] Test the Geolocation coordinates locator button in a browser over HTTPS. (Geolocation is blocked by browsers on unsecured HTTP connections).
- [ ] Upload an image larger than 2MB to verify that the size warning triggers.
- [ ] Submit a test ticket and verify that a unique Reference ID is returned and the success page renders.
- [ ] Paste the Reference ID in the Track page search box to verify that n8n retrieves the details correctly.
- [ ] Check console logs to ensure there are no broken relative links or unresolved script errors.
- [ ] Verify that all text assets match contrast requirements for accessibility.
