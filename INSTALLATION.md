# Installation & Deployment Guide

This guide details how to set up, run, test, and deploy the **Smart Civic AI** issue management platform.

---

## 💻 1. Running Locally in Browser (No Server Required)

Because the application is written entirely in Vanilla HTML5, CSS3, and JavaScript with no dependencies or package managers, you can launch the platform directly on any device:

1. **Extract/Download** the project files to a folder on your drive (e.g., `C:\Projects\Smart-Civic-AI`).
2. Double-click the [index.html](index.html) file in the root folder.
3. The platform will load in your default browser.
4. **Note on Geolocation**: Browsers restrict coordinates access via the `navigator.geolocation` API when running from a local file protocol (`file:///`). To test the active location lookup button, use the Live Server method detailed below.

---

## ⚡ 2. Running via VS Code (Recommended)

To run the application inside a local HTTP server environment, use Microsoft VS Code:

1. Download and install [VS Code](https://code.visualstudio.com/).
2. Open VS Code. Go to **File** > **Open Folder...** and select the `Smart-Civic-AI` root folder.
3. Install the **Live Server** extension:
   - Click the Extensions icon on the left-side panel (or press `Ctrl+Shift+X`).
   - Search for **"Live Server"** by *Ritwick Dey*.
   - Click **Install**.
4. Launch the server:
   - Right-click [index.html](index.html) in the file navigator and click **Open with Live Server** (or click the **"Go Live"** button in the status bar at the bottom right).
5. Your browser will automatically launch the platform at `http://127.0.0.1:5500/index.html`. 
6. Geolocation API and caching features will now work with standard HTTPS-like permissions.

---

## 🌐 3. Static Deployment Options

Since this project consists of static files only, you can host it for free on several popular developer platforms.

### Option A: GitHub Pages (Recommended)
1. Initialize a Git repository in your folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Smart Civic AI"
   ```
2. Create a new repository on [GitHub](https://github.com/) named `smart-civic-ai`.
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/your-username/smart-civic-ai.git
   git branch -M main
   git push -u origin main
   ```
4. Configure GitHub Pages:
   - Go to your repository's page on GitHub.
   - Click **Settings** > **Pages** (in the left sidebar).
   - Under "Build and deployment", set the Source to **Deploy from a branch**.
   - Under "Branch", select **main** and folder **/(root)**.
   - Click **Save**.
5. Your site will be live at `https://your-username.github.io/smart-civic-ai/` in a few minutes.

### Option B: Netlify
1. Create a free account on [Netlify](https://www.netlify.com/).
2. Go to the dashboard and select **Add new site** > **Deploy manually**.
3. Drag and drop the entire `Smart-Civic-AI` root folder into the upload dropzone.
4. Netlify will configure DNS nodes and serve your platform live in seconds.

### Option C: Vercel
1. Install Vercel CLI locally or connect your GitHub repository directly at [Vercel](https://vercel.com/).
2. Select **Add New Project**, link your repo, leave default settings, and click **Deploy**.

---

## 🔗 4. Configuring n8n Production Webhooks

When you are ready to connect to your live n8n backend:
1. Ensure your n8n instance is running and has a **Webhook** node configured.
2. Update the webhook parameters inside [js/utils.js](js/utils.js#L11-L15):
   - Set `mode` to `'webhook'`.
   - Set `webhookUrl` to your production webhook endpoint (e.g., `https://yourdomain.n8n.cloud/webhook/civic-complaint`).
3. Deploy the files to your server. The platform is now fully integrated.
