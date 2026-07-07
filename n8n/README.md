# Book-a-Meeting → Email Automation (n8n)

This folder contains the n8n workflow that powers the website's "Book a Meeting" form.

**Flow:** Website form → POST to n8n webhook → verify Cloudflare Turnstile → honeypot check → (1) email the lead's details to `partners@jarvisksa.com`, (2) auto-send the visitor a thank-you email **from** `partners@jarvisksa.com` in their language (EN/AR).

```
Webhook → Verify Turnstile → Turnstile OK? ──true──▶ Is Human? (honeypot) ──true──▶ Email Team ──▶ Language == AR? ──▶ Thank You (AR/EN) ──▶ Respond OK
                             └──false (bot / bad token)──────────────────────────────────────────────────────────────────────────────────▶ Respond OK
```

> **Why two checks?** The honeypot alone is trivially bypassed by anyone who reads the
> site's JS and simply leaves the hidden field empty. Turnstile adds a real, server-verified
> proof-of-human so the public webhook can't be used to spam `partners@` or as an email relay.

---

## One-time setup

### 1. Import the workflow
- In n8n: **top-right menu → Import from File** → choose `book-meeting.workflow.json`.

### 2. Connect your Outlook (Microsoft 365) account
The three email nodes (`Email Team`, `Thank You (Arabic)`, `Thank You (English)`) need a credential.
- Open any of those nodes → **Credential to connect with → Create New** → **Microsoft Outlook OAuth2 API**.
- Sign in with an account that can **send as `partners@jarvisksa.com`** (ideally log in as partners@ itself).
- Select that same credential on all **three** Outlook nodes.

> n8n Cloud handles the OAuth redirect automatically. If you self-host, you'll register an app in Azure (Entra ID) and set the redirect URL n8n shows you — n8n's docs walk through this.

### 3. Verify the email-node fields (quick sanity check)
Open each Outlook node and confirm:
- **Email Team (partners@):** `To` = `partners@jarvisksa.com`; `Reply To` (Additional Fields) = `{{ $('Webhook').item.json.body.email }}` so replies go to the lead.
- **Thank You (AR/EN):** `To` = `{{ $('Webhook').item.json.body.email }}`; body type = HTML.
- If your n8n version labels a field differently (e.g. `To Recipients` vs `To`), just map it to the same value — the expressions are the important part.

### 4. Activate + grab the webhook URL
- Toggle the workflow **Active** (top-right).
- Open the **Webhook** node → copy the **Production URL** (looks like `https://<your-n8n>/webhook/book-meeting`).
- Give that URL to put into the website (see below). The test URL (`/webhook-test/...`) only works while you click "Listen for test event".

### 5. Point the website at the webhook
Set the env var **`VITE_N8N_WEBHOOK_URL`** to your Production URL in two places:
- **Local dev:** in `.env.local` at the project root.
- **Production:** Vercel → Project → **Settings → Environment Variables** (add for Production + Preview), then redeploy.

---

## Anti-spam: Cloudflare Turnstile (recommended)

Without this, the webhook is public and the honeypot is bypassable, so anyone can spam
`partners@` or trigger thank-you emails to arbitrary addresses. Turnstile fixes that.
It's already wired into both the site and this workflow — you just add the keys.

**Get free keys:** Cloudflare dashboard → **Turnstile → Add site** → domain `jarvisksa.com`
(add `localhost` too for dev). You get a **Site key** (public) and a **Secret key** (private).

**Do it in this order so lead capture never breaks:**

1. **Site (frontend) first.** Set `VITE_TURNSTILE_SITE_KEY` = your **Site key** in `.env.local`
   and in Vercel (Production + Preview), then redeploy. Until this is set, the form works
   with no CAPTCHA — nothing breaks. Once set, the widget appears and every submission
   carries a `turnstileToken`.
2. **n8n second.** Import the updated `book-meeting.workflow.json`, open the **Verify Turnstile**
   node, and replace `PASTE_YOUR_TURNSTILE_SECRET_KEY` with your **Secret key**. Save + keep Active.

> ⚠️ Import the updated workflow **only after** step 1 is live. If n8n starts verifying tokens
> before the site sends them, submissions will be silently treated as bots (no emails).
> The **Verify Turnstile** node calls `https://challenges.cloudflare.com/turnstile/v0/siteverify`;
> **Turnstile OK?** proceeds only when Cloudflare returns `success: true`.

---

## CORS
The Webhook node already allows these origins (edit in the node's **Options → Allowed Origins** if your domain differs):
```
https://jarvisksa.com, https://www.jarvisksa.com, http://localhost:3000
```
If the browser console shows a CORS error on submit, add the exact site origin here.

---

## The data the website sends
The form POSTs this JSON (available in expressions as `$('Webhook').item.json.body.*`):

| Field | Example | Notes |
|-------|---------|-------|
| `name` | "Sara Ali" | |
| `email` | "sara@acme.com" | visitor's email (thank-you recipient + reply-to) |
| `company` | "Acme Co" | |
| `phone` | "+9665…" | |
| `sector` | "FINANCE" | human-readable English label |
| `sectorId` | "finance" | raw id |
| `system` | "Smart Auditing" | chosen sub-system, or the free-text custom description |
| `isCustom` | false | true when the visitor picked "Custom" |
| `language` | "en" or "ar" | drives which thank-you template is sent |
| `company_website` | "" | **honeypot** — always empty for real users; if filled, the workflow skips emails |
| `turnstileToken` | "0.abc…" | Cloudflare Turnstile token; empty when the CAPTCHA is disabled. Verified server-side |

---

## Testing
1. In n8n, click **Listen for test event** (or keep it Active), then submit the form on the site (or `curl`):
   ```bash
   curl -X POST 'https://<your-n8n>/webhook/book-meeting' \
     -H 'Content-Type: application/json' \
     -d '{"name":"Test User","email":"YOUR_TEST_INBOX@example.com","company":"Test Co","phone":"+966500000000","sector":"FINANCE","system":"Smart Auditing","language":"en","company_website":""}'
   ```
2. Confirm `partners@jarvisksa.com` gets the lead email, and `YOUR_TEST_INBOX` gets the thank-you.
3. Change `"language":"ar"` and re-run → thank-you should arrive in Arabic.
4. Set `"company_website":"x"` → no emails should be sent (bot path), but you still get `{"ok":true}`.

> **Note when Turnstile is enabled:** a raw `curl` has no valid token, so it will be treated as
> a bot (no emails, still `{"ok":true}`). Test through the real site instead, or temporarily
> disconnect the **Verify Turnstile** node while testing. Turnstile tokens are single-use and
> short-lived, so each real submission gets a fresh one from the widget.
