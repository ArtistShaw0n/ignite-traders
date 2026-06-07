# IGNITE Traders — Project Context for Claude Code

@AGENTS.md

> **For agents:** This file is auto-loaded at the start of every Claude Code session.
> Read it before doing anything else.

---

## Project at a glance

- **Product:** Marketing site for IGNITE Traders — protective wear & safety supply for pharmaceutical production units
- **Stack:** Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS v4
- **Live:** https://ignite-traders.vercel.app
- **Repo:** https://github.com/ArtistShaw0n/ignite-traders
- **Dev port:** 3003 (locked in `package.json`)

---

## Multi-device workflow (Office Mac ↔ Home Windows)

This project is worked on from **two machines** in **sequential** mode (not simultaneous):
- Day → Office Mac
- Evening → Home Windows PC

Claude Code chat sessions are **local to each machine** — they do NOT sync via the Anthropic account.
Continuity is achieved via files committed to Git: `NOTES.md`, `CLAUDE.md`, and commit messages.

### 📍 Source of truth & where the repo lives

- **GitHub (`origin/main`) is the single source of truth.** Move code between machines
  **only** via Git (`git pull` / `git push`) — never by copying folders or relying on
  cloud-folder sync. (Google Drive is no longer used for this project.)
- On this Mac the working copy lives inside the **MEGA cloud-sync folder** (`~/MEGA/…`).
  That's incidental — MEGA is **not** the sync mechanism between machines and must not be
  relied on for it. On any other machine, `git clone` from GitHub into a normal
  (non-synced) folder.
- ⚠️ Because MEGA syncs this folder, it can occasionally drop `* 2` conflict files into
  `.git/` and jam `git fetch` / `git pull`. If git hangs or errors oddly:
  ```bash
  find .git -name "* 2*" -delete
  find .git -name "* 2*" -type d -exec rm -rf {} +
  ```
  then retry. (To avoid this entirely, exclude this folder in MEGAsync settings.)

### 🚀 Always commit + push (standing rule — do NOT ask each time)

The user has given **standing approval**: after completing any task that changes tracked
files — and after the relevant checks pass (`npm run type-check`, `npm run lint`, and
`npm run build` when applicable) — **commit with a descriptive message and
`git push origin main` automatically, without asking.** Pushing `main` auto-deploys to
Vercel, so "push to git" and "push to Vercel" are the same single action.

- Stage **specific files** (never `git add .` / `-A`) so `.env.local` and build junk
  can't slip in.
- Group unrelated changes into separate, well-described commits.
- Only skip the push for genuinely incomplete or broken WIP — and say so explicitly.

### 🟢 At the START of every session (any machine)

Run these first, in this order:

```bash
git pull origin main          # Latest code from other machine
npm install                   # If package-lock changed since last time
```

Then, **before doing anything else**, the agent must:
1. Read `NOTES.md` if it exists — that's where the last session left handoff notes.
2. Read recent commit messages: `git log --oneline -10` — to see what's been done.
3. Confirm with the user what to work on (do not assume).

### 🔴 Before the user STOPS work (handoff to other machine)

When the user says "save progress", "EOD", "end of day", "switching machines", or similar:

1. Update `NOTES.md` with the following sections:
   ```markdown
   # Session Notes — <YYYY-MM-DD> (<office | home>)

   ## ✅ Completed today
   - <bullet list of what got finished>

   ## 🚧 In progress (WIP)
   - <half-done items, with file paths and what's left>

   ## ❓ Open questions / blockers
   - <decisions needed, things stuck on>

   ## ▶️ Next steps
   - <prioritized list of what to tackle next>
   ```

2. Stage, commit, and push:
   ```bash
   git add NOTES.md <other changed files>
   git commit -m "WIP: <short description>

   <optional longer body>"
   git push origin main
   ```

3. Mention to the user: "Pushed. Safe to switch to the other machine."

---

## Project conventions

### Code style
- 2-space indent, double quotes, trailing commas (see `.prettierrc`)
- Run `npm run format` for big refactors
- Run `npm run type-check` before committing

### Components — atomic design
- `components/atoms/` — smallest UI primitives (Button, Badge, Logo…)
- `components/molecules/` — composite UI (FeatureCard, ProductCard…)
- `components/organisms/` — page sections (Header, Footer, HeroBanner…)
- Each folder has a barrel `index.ts` — use named exports

### Pages
- App Router only (no `pages/` directory)
- Marketing pages under `app/(marketing)/` route group
- SEO files: `app/robots.ts`, `app/sitemap.ts`, JSON-LD in `lib/jsonld.ts`

### Data
- Product catalog: `data/products.json`
- Helpers: `lib/products.ts`

### Styling
- Tailwind v4 — configured via `@import "tailwindcss"` in `app/globals.css`
- **No `tailwind.config.js`** — that's intentional (Tailwind v4 uses CSS-based config)
- Design tokens live in `globals.css`
- No inline styles, no CSS modules — Tailwind classes only

### Environment
- Read site URL from `process.env.NEXT_PUBLIC_SITE_URL` (falls back to `https://ignitetradersbd.com`)
- Vercel: env var is set in **Production**, **Preview**, and **Development** to `https://ignite-traders.vercel.app`
- Local: copy `.env.example` → `.env.local` if you need overrides

---

## Useful commands

```bash
# Development
npm run dev              # Dev server on port 3003
npm run build            # Production build
npm run start            # Run prod build locally on 3003

# Quality
npm run lint             # ESLint
npm run type-check       # tsc --noEmit
npm run format           # Prettier write
npm run format:check     # Prettier check

# Vercel (CLI installed both PCs)
vercel ls                # Recent deployments
vercel env ls            # Env vars on Vercel
vercel logs <url>        # View deployment logs
```

---

## Deployment

- **Auto-deploy:** every `git push origin main` triggers a fresh Vercel build
- **Preview:** `git push` on any non-main branch creates a preview deployment with its own URL
- **Manual redeploy:** `git commit --allow-empty -m "Redeploy" && git push`

---

## Milestone snapshots — GitHub Releases

When the user says "release", "snapshot", "milestone", "tag this version", or similar:

1. Determine the next version using semver:
   - `v0.X.0` = pre-launch features
   - `v1.0.0` = first public launch
   - `v1.X.0` = minor updates after launch
   - `v1.X.Y` = patches/fixes
2. Make sure working tree is clean (`git status` should be empty)
3. Create an annotated tag and push it:
   ```bash
   git tag -a v0.X.0 -m "Release v0.X.0 — <short description>"
   git push origin v0.X.0
   ```
4. Use `gh` to create the release with auto-generated notes:
   ```bash
   gh release create v0.X.0 --generate-notes --title "v0.X.0 — <short description>"
   ```
5. Confirm to the user with the release URL:
   `https://github.com/ArtistShaw0n/ignite-traders/releases/tag/v0.X.0`

GitHub auto-creates downloadable `.zip` and `.tar.gz` for each release. These are the "exports per milestone" — accessible from anywhere, never expire.

---

## ⚠️ Important — read before writing code

See `AGENTS.md` (imported above). This project uses a version of Next.js with breaking changes from typical training data. Before writing Next.js-specific code (routing, data fetching, metadata, etc.), check `node_modules/next/dist/docs/` for the relevant guide.
