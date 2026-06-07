# Session Notes — 2026-06-08 (office)

> Live: https://ignite-traders.vercel.app
> Big session: replaced Clerk with self-contained auth + worked the whole
> launch-readiness checklist. All code-side items done, deployed, verified.

## ✅ Completed this session

### 🔐 Auth: Clerk → fully self-contained (Auth.js)
- **No external auth service.** Auth.js v5 (Credentials) + `bcryptjs`; login is
  email + password verified against the `admin_users` table (new `password_hash`
  column, migration `0004`, applied to Neon). The table **is** the allowlist.
- New `/admin/sign-in` form + Sign-out; `proxy.ts` (was `middleware.ts`) +
  `lib/auth.ts` use the Auth.js JWT session. `@clerk/nextjs` removed.
- **`/admin/admins`**: add admin = email + initial password; remove blocked for
  the last admin and for yourself.
- **First admin / password reset:** `npx tsx db/create-admin-user.ts <email> <pw>`
  (bcrypt-hashed; password never leaves your machine).
- **Security review (3 adversarial agents) → no bypass found.** Hardened the real
  gaps: getAdminUser re-checks the DB every request (removing an admin revokes
  access immediately), constant-time login (dummy bcrypt on unknown email),
  atomic last-admin guard, 7-day session cap, `AUTH_SECRET` set in Vercel Prod.

### 🚀 Launch-readiness (7 commits)
- **Cleanup:** removed "Design System" from public nav; `/design-system` +
  `/preview` now 404 in production; stripped `[TODO replace verbatim]` markers
  from About; deleted junk "Test Product by Tasawoof" (`/products/slug`) from DB.
- **SEO:** per-page canonicals (was: every page canonical'd to homepage = dupes);
  branded 1200×630 OG share image (`app/opengraph-image.tsx`); product JSON-LD
  fixed (dropped the invalid price-less Offer, added images).
- **a11y:** `--fg-muted` darkened to AA (neutral-500→600); global `:focus-visible`
  ring; heading order; form `aria-invalid`/`aria-describedby`; dark-mode inputs;
  `role="img"` on logo cards; admin skip-link.
- **Perf/security:** product reads wrapped in React `cache()`; image-upload route
  hardened (magic-byte sniff, SVG rejected, server-generated filename); removed
  unused `framer-motion`.
- **PWA/polish:** web manifest + branded `app/icon.tsx` + `app/apple-icon.tsx`;
  OG locale `en_US`→`en_BD`.
- **chore:** prettier baseline across `app/components/lib/db` (~56 files) so future
  diffs stay clean. `middleware.ts` → `proxy.ts` (Next 16 deprecation gone).

> Note: inquiry/quote + FAQ were hidden in a prior session (private `_contact` /
> `_inquiries` folders, code kept). Categories + multi-admin are DB-backed.

## 🚧 In progress (WIP)
- None code-side. Everything above is committed, deployed, and build-verified.

## ❓ Open / needs the user (asset · access · DNS · infra)
1. **Real product images** — upload via `/admin → Products` (cards show the
   silhouette placeholder until then).
2. **Domain cutover** — point `ignitetradersbd.com` at Vercel in DeshiHosting
   (A → `76.76.21.21`), keep MX/SPF/DKIM for email. **Then I** set
   `NEXT_PUBLIC_SITE_URL=https://ignitetradersbd.com` (Prod/Preview) + redeploy.
3. **Rate-limiting** on sign-in (only remaining security gap) — provision Upstash
   Redis (Vercel Marketplace, free) and I'll wire `@upstash/ratelimit`, OR enable
   a Vercel WAF rate rule on `/api/auth/*`.
4. **Change the admin password** before launch — the bootstrap one is in a
   screenshot + shell history. Re-run `create-admin-user.ts` with a new password.
5. **Resend** — verify `ignitetradersbd.com` (DNS) + set `RESEND_API_KEY` /
   `RESEND_FROM_EMAIL` / `RESEND_WEBHOOK_SECRET` when email is needed (inquiry is
   currently hidden, so not urgent).
6. (Optional) Real permitted client logos for the "Trusted by" section (confirmed
   real clients — currently styled-text wordmarks); final About copy.
7. **Preview `AUTH_SECRET`** — set in Vercel only for Production; add to Preview in
   the dashboard if you ever use preview deploys (main-only workflow → not needed).

## 🟡 Deferred (low priority — ask if you want it)
- Custom sort `Dropdown` announces `role="listbox"` but isn't a full listbox.
  It's keyboard-operable; a proper fix = native `<select>` or full ARIA listbox
  (a design decision, so left as-is).

## ▶️ Next steps (priority order)
1. Upload real product images.
2. Change the admin password.
3. DNS cutover → ping me to set `NEXT_PUBLIC_SITE_URL` + redeploy.
4. Decide rate-limit approach (Upstash vs WAF) → I wire it.
5. (At launch) Resend domain verify if email is wanted.

## 🔑 Key facts for the other machine
- **Admin login is now email + password** (NOT Clerk): `/admin/sign-in`.
  Create/reset an admin: `npx tsx db/create-admin-user.ts <email> <password>`.
- `AUTH_SECRET` is required — in Vercel Production + `.env.local` (local dev).
- `npm run db:seed` reseeds products; `npm run db:peek` inspects inquiry/email log.
- Vercel Blob store: `ignite-product-images` (public).
- Real domain is `ignitetradersbd.com` (with the "r"). Code falls back to it when
  `NEXT_PUBLIC_SITE_URL` is unset.
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
