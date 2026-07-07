<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1J5ffvO8REqphzX_oGgp4mY_JnUpgSDWG

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and fill in the values
   (at minimum `VITE_N8N_WEBHOOK_URL`). See [n8n/README.md](n8n/README.md) for the
   contact-form backend and the optional Cloudflare Turnstile anti-spam setup.
3. Run the app:
   `npm run dev`

> This is a **frontend-only** build. Every `VITE_*` variable is bundled into the public
> client JS — treat them all as public and never put a real secret in one.
