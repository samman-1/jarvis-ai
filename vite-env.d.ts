/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** n8n webhook URL the Book-a-Meeting form posts to. */
  readonly VITE_N8N_WEBHOOK_URL: string;
  /** Cloudflare Turnstile SITE key (public). Empty/undefined disables the CAPTCHA. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
