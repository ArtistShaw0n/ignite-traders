# Session Notes — 2026-05-20 (office)

## ✅ Completed today

- **FAQ section on homepage** (commit `d2970ad`, deployed to https://ignite-traders.vercel.app/):
  - New organism [components/organisms/FaqSection.tsx](components/organisms/FaqSection.tsx) — server component, native `<details>` accordion, rotating `+` icon.
  - Wired into [app/(marketing)/page.tsx](<app/(marketing)/page.tsx>) between Trusted Companies and Request Quote CTA (`tone="muted"`).
  - 6 B2B FAQs (MOQ, lead time, industries, samples, quotes, payment terms).
- **FAQ anchor wiring** (uncommitted — being pushed now):
  - `id` prop on [FaqSection.tsx](components/organisms/FaqSection.tsx) with default `"faq"` + `scroll-mt-24` for sticky-header offset.
  - "FAQ" link added to header nav in [Header.tsx](components/organisms/Header.tsx) pointing to `/#faq`.

## 🚧 In progress (WIP)

- None — all changes from this session are committed and pushed.

## ❓ Open questions / blockers

- None.

## ▶️ Next steps

- Add `faqJsonLd()` helper to [lib/jsonld.ts](lib/jsonld.ts) and inject FAQPage schema on the homepage for SEO.
- Consider localising FAQ copy for Bangla audience (or providing a `/bn` route group).
- Audit other organism sections for missing `id`/`scroll-mt-24` so footer/header anchor links land cleanly.

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
