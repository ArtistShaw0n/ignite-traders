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
- Read site URL from `process.env.NEXT_PUBLIC_SITE_URL` (falls back to `https://ignitetradesbd.com`)
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

## ⚠️ Important — read before writing code

See `AGENTS.md` (imported above). This project uses a version of Next.js with breaking changes from typical training data. Before writing Next.js-specific code (routing, data fetching, metadata, etc.), check `node_modules/next/dist/docs/` for the relevant guide.
