# Session Notes — 2026-06-05 (office)

> **Milestone: full backend complete (Tier 4).** Tagged `v0.5.0`.
> Live: https://ignite-traders.vercel.app

## ✅ Completed today

Implemented **all of BACKEND-PLAN.md Phases 4–10** (Phases 1–3 — DB schema,
working contact form → DB, Resend emails — were done in the prior session).

- **Phase 7 — Products → Postgres.** Added `sku/material/usage_area/bulk_supply`
  columns, `badge` → jsonb, `description` NOT NULL (migration `0001`, applied via
  direct SQL because drizzle-kit migrate hangs on Neon's serverless websocket;
  recorded in `drizzle.__drizzle_migrations`). New `db/seed.ts` (`npm run db:seed`)
  upserts the 12 products by slug. `lib/products.ts` is now async + DB-backed; all
  consumers (`sitemap`, home, `/products`, detail) await it.
- **Phase 4 — Per-product quote form.** Detail page renders `ContactForm` with
  `source="product-page"`, `productId={product.id}` (real UUID), `showQuantity`.
- **Phase 5 — Clerk admin auth.** `middleware.ts` gates `/admin/*` (passes through
  if Clerk keys absent, so local dev never breaks); `lib/auth.ts` `requireAdmin()` +
  `getAdminUser()`; `/admin` shell + `/admin/sign-in`. Clerk via Vercel Marketplace.
- **Phase 6 — Inquiries dashboard.** `/admin/inquiries` (list + status-filter pills
  w/ counts), `/admin/inquiries/[id]` (detail + optimistic status update + email log),
  `/admin/inquiries/export` (admin-gated CSV). Landing shows status cards + recent.
- **Phase 8 — Product CMS.** `/admin/products` CRUD (create/edit/delete + flags),
  shared `ProductForm`. **Image upload** via `/api/admin/upload-image` → Vercel Blob
  `put({access:'public'})`; `ImageUploader`; images wired into cards + detail gallery.
  `next.config` allows `*.public.blob.vercel-storage.com`.
- **Phase 9 — Resend webhook.** `/api/webhooks/resend` (svix-verified) updates
  `email_log.status` by `resend_id`. **Code live but NOT activated** (see blockers).
- **Phase 10 — Analytics + lead source.** `@vercel/analytics` in root layout;
  lead-source breakdown (bars + %) on the admin dashboard.

### Bugs caught & fixed this session
- **Empty-string env locked admins out:** `ADMIN_EMAIL=""` + `??` (only catches
  null/undefined) → empty allowlist → everyone redirected. Switched `??` → `||` in
  `lib/auth.ts` + `lib/email.ts` (also fixed admin emails silently going to "").
  Set `ADMIN_EMAILS=shawon221b@gmail.com,uiux1.opl@gmail.com` on Vercel.
- **`/admin` 404 for signed-out users:** Clerk v7 `auth.protect()` throws notFound
  unless given `unauthenticatedUrl` → added it (redirects to `/admin/sign-in`).
- **Blob "private store" rejected public images:** the first store was created
  **private** → `put({access:'public'})` failed. Recreated as **public** via CLI
  (`vercel blob create-store … --access public`), deleted the private one.

## 🚧 In progress (WIP)
- None — all 10 phases are code-complete, deployed, and verified.

## ❓ Open questions / blockers
- **Phase 9 webhook not activated.** Needs (a) a webhook at https://resend.com/webhooks
  → `https://ignite-traders.vercel.app/api/webhooks/resend` for events
  `email.sent/delivered/bounced/complained`, and (b) its signing secret as
  `RESEND_WEBHOOK_SECRET` in Vercel (Production+Preview) + redeploy. Until then the
  route returns 500 "not configured" (harmless; sending still works).
- **Resend domain not verified.** Sender unverified / sandbox — can only deliver to
  the verified Resend account inbox. Verify `ignitetradesbd.com` for production email.
- **Clerk on dev keys.** Fine for `*.vercel.app`; switch to production keys when the
  real domain goes live.
- **Hobby env note:** Clerk + Blob creds live in Production+Preview only (Development
  is locked on Hobby) — local `npm run dev` won't have them; `/admin` won't work
  locally unless you pull them into `.env.local`.

## ▶️ Next steps (priority order)
1. (Optional) Activate the Phase 9 Resend webhook (see blockers).
2. Upload real product photos via `/admin/products` (catalog shows the silhouette
   placeholder until then).
3. (Optional) Verify `ignitetradesbd.com` on Resend → production email.
4. At real-domain launch: Clerk production keys + set `NEXT_PUBLIC_SITE_URL`.
5. Future polish: inquiries-list pagination at volume; product image reordering;
   Bangla email templates (currently English-only).

## 🔑 Key facts for the other machine
- Admin: sign in at `/admin` with `shawon221b@gmail.com` (or `uiux1.opl@gmail.com`).
- `npm run db:seed` reseeds products; `npm run db:peek` inspects inquiries/email log.
- Vercel Blob store: `ignite-product-images` (public, `store_pL3yzXHMZwXRTVdf`).
- Never paste API keys/tokens in chat; never commit `.env.local`.

## ⚠️ Multi-device / cloud-sync note for whoever picks this up
- **GitHub is the source of truth** — move code between machines only via
  `git pull` / `git push`, never via cloud-folder sync. (Google Drive is no
  longer used for this project.)
- On this Mac the repo sits inside the **MEGA cloud-sync folder** (`~/MEGA/…`).
  MEGA's sync can write `* 2` conflict files into `.git/`, jamming `git fetch`.
  If git hangs:
  `find .git -name "* 2*" -delete` + `find .git -name "* 2*" -type d -exec rm -rf {} +`,
  then retry. (To avoid entirely: exclude this folder in MEGAsync settings, or
  `git clone` into a non-synced folder — GitHub stays the backup either way.)
- On any **other machine**, `git clone` fresh from GitHub into a normal folder —
  do not reuse any leftover Google Drive copy.
- Always `git pull origin main` and `npm install` **before** starting work.

---

# 🔁 Git Push Workflow — Quick Reference

Daily flow whenever you've changed code and want it on GitHub + Vercel:

```bash
# 1. দেখো কী কী file change হয়েছে
git status

# 2. পরিবর্তনগুলো review করো (optional but recommended)
git diff

# 3. Specific files stage করো (preferred over `git add .`)
git add path/to/file1 path/to/file2

# 4. Commit করো — short, descriptive message
git commit -m "Short title

- bullet point of what changed
- another bullet if needed"

# 5. Push করো — এটাই Vercel auto-deploy trigger করে
git push origin main
```

## Multi-device handoff (Office Mac ↔ Home Windows)

**Switch করার আগে (current machine-এ):**

```bash
git status                       # WIP আছে কিনা check
# NOTES.md update করো (এই file)
git add NOTES.md <other files>
git commit -m "WIP: <what's pending>"
git push origin main
```

**Switch করার পরে (other machine-এ):**

```bash
git pull origin main             # latest code টানো
npm install                      # package-lock change হলে
# তারপর NOTES.md পড়ো, work resume করো
```

## ⚠️ যা করবে না

- `git add .` বা `git add -A` — accidentally `.env.local` বা `node_modules` ঢুকে যেতে পারে। সবসময় specific file path লেখো।
- `git push --force` কখনোই main-এ না — history rewrite হয়ে যাবে, অন্য machine থেকে pull করতে গেলে conflict।
- `--no-verify` ব্যবহার করে pre-commit hook skip — কারণ hook ব্যর্থ মানে কোথাও issue আছে, সেটাই fix করো।
- Commit messages-এ "fix" / "update" / "wip" এর মতো বানিজ্যিক ভাষা — actual কী হলো লেখো ("Add FAQ section to homepage" ভালো, "update" খারাপ)।

## Vercel Auto-Deploy

প্রতিটা `git push origin main` → Vercel automatic build শুরু করে → ~১-২ মিনিটে production live।

Build status check:

```bash
vercel ls           # সর্বশেষ deployments
vercel logs <url>   # specific deployment-এর log
```

বা browser-এ: https://vercel.com/dashboard → ignite-traders → Deployments
