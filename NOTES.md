# Session Notes — 2026-06-03 (office)

## ✅ Completed today

- **Re-added WhatsApp Chat CTA to home hero banner** (commit `39767c3`, deployed):
  - Pulled latest from origin (was behind by 3 commits: FAQ anchor wire, WhatsApp removal, theme toggle).
  - Reverted `6f15e80` (the "Remove WhatsApp CTA" commit from home session) to bring the third CTA back without disturbing the theme toggle or FAQ anchor work.
  - Production now shows 3 hero CTAs: **Browse Products** → **Request Quote** → **WhatsApp Chat** (green, prefilled with "Hi! I'd like to know more about IGNITE products.").
  - Verified live at https://ignite-traders.vercel.app — HTTP 200, all 3 labels in rendered HTML.

- **Authored full backend architecture plan** ([BACKEND-PLAN.md](BACKEND-PLAN.md)):
  - User asked for **Tier 4** scope: working forms → DB → admin dashboard → product CMS.
  - 14-section document covers: tech stack, data model (3 tables in Drizzle), file structure, auth strategy (Clerk), email flows (Resend), storage (Vercel Blob), env vars, 10-phase rollout, cost estimate ($0/mo within free tiers), risks, non-goals.
  - **Not implemented yet** — user opted "plan only" first.

## 🧹 Housekeeping done this session

- Killed zombie dev server (PID 94450) that was pointing at a deleted `.Trash/Website Design/recovery/1/ignite-website` directory and squatting port 3003.
- Cleaned 22 Google Drive sync conflict files inside `.git/` (`FETCH_HEAD 2`, duplicate `objects/XX 2/` dirs, `refs/remotes/origin/main 2`). These were jamming `git fetch`.
- Removed a `.claude 2/` Google Drive conflict directory in the project root.
- Ran `npm install` (node_modules wasn't present on this machine — first time pulling deps in this clone).
- Re-linked the local repo to the Vercel project (`.vercel/` was missing; `vercel link` was needed before `vercel ls` worked).

## 🚧 In progress (WIP)

- None — both deliverables (CTA re-add + backend plan) are committed/staged for push.

## ❓ Open questions / blockers (need owner's answers before Phase 1 implementation)

All from [BACKEND-PLAN.md §10](BACKEND-PLAN.md):

1. **Sender domain** for transactional email — `no-reply@ignitetradesbd.com` ok? (Requires DNS verification on Resend.)
2. **First admin email** for Clerk role assignment — default `shawon221b@gmail.com`?
3. **Spam strategy** — honeypot only, or also Vercel BotID / reCAPTCHA?
4. **Inquiry retention** — keep forever vs auto-archive after N months?
5. **Multi-admin** — anyone with Clerk `admin` role can manage, ok?
6. **Bangla email templates** — v1 English-only or both?

## ▶️ Next steps

1. **Owner reviews [BACKEND-PLAN.md](BACKEND-PLAN.md)** — confirm scope, stack picks, phase order, and answer the 6 questions above. If stack changes desired (e.g. Prisma over Drizzle, NextAuth over Clerk), discuss before Phase 1.
2. **Phase 1 — DB foundation** (next coding session):
   - Provision Neon Postgres via Vercel Marketplace.
   - Write Drizzle schema for `inquiries`, `products`, `emailLog`.
   - Add `db:generate` / `db:migrate` / `db:seed` scripts.
   - No UI changes in this phase — pure backend foundation.
3. **Carry-overs from prior home session** (still valid, not done today):
   - Theme-init FOUC fix: swap `<Script id="theme-init" strategy="beforeInteractive">` for a raw `<script dangerouslySetInnerHTML>` inside `<head>` in `app/layout.tsx`.
   - `faqJsonLd()` helper in `lib/jsonld.ts` + inject FAQPage schema on homepage for SEO.
   - Bangla copy variant for FAQ (or `/bn` route group).
   - Audit organism `id`/`scroll-mt-24` for anchor-link landing.

## ⚠️ Multi-device note for whoever picks this up

- This repo lives in **Google Drive** (`~/Library/CloudStorage/GoogleDrive-…`) — Drive's real-time sync occasionally writes `* 2` conflict files into `.git/`, which jams `git fetch`. If `git fetch` hangs: `find .git -name "* 2" -delete` + `find .git -name "* 2" -type d -exec rm -rf {} +`, then retry.
- Always run `git pull origin main` and `npm install` **before** starting work — this session lost time because the local was behind by 3 commits.

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
