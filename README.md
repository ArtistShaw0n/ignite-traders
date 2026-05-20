# IGNITE — Protective Wear for Pharma Production

Marketing site for IGNITE Traders — protective wear & safety supply for pharmaceutical production units.

Built with **Next.js 16 (App Router + Turbopack)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## Tech stack

| Layer            | Tool                                |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 16.2 (App Router, Turbopack) |
| UI               | React 19, Tailwind CSS v4           |
| Language         | TypeScript 5                        |
| Animation        | Framer Motion 12                    |
| Icons            | lucide-react                        |
| Forms            | react-hook-form                     |
| Linting          | ESLint (eslint-config-next)         |
| Formatting       | Prettier                            |

---

## Getting started

### Prerequisites

- **Node.js**: see `.nvmrc` (Node 22.x). If using `nvm`, run `nvm use`.
- **npm**: comes with Node.

### Install & run

```bash
# Install dependencies
npm install

# Copy env template (then edit values)
cp .env.example .env.local

# Start dev server on port 3003
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) in your browser.

---

## Available scripts

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start dev server (Turbopack) on port 3003 |
| `npm run build`        | Build for production                      |
| `npm run start`        | Start production server                   |
| `npm run lint`         | Run ESLint                                |
| `npm run format`       | Format all files with Prettier            |
| `npm run format:check` | Check formatting without writing          |
| `npm run type-check`   | Run TypeScript without emitting files     |

---

## Project structure

```
ignite-website/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Marketing route group
│   │   ├── about/
│   │   ├── contact/
│   │   ├── products/
│   │   │   └── [slug]/         # Dynamic product detail
│   │   ├── layout.tsx
│   │   └── page.tsx            # Home
│   ├── design-system/          # Internal design-system showcase
│   ├── preview/                # Component previews
│   ├── globals.css             # Tailwind v4 + design tokens
│   ├── layout.tsx              # Root layout
│   ├── not-found.tsx
│   ├── robots.ts               # SEO: robots.txt
│   └── sitemap.ts              # SEO: sitemap.xml
├── components/
│   ├── atoms/                  # Smallest UI primitives
│   ├── molecules/              # Composite UI
│   └── organisms/              # Page sections
├── lib/                        # Utilities (clsx, jsonld, products, site)
├── data/products.json          # Product catalog data
└── public/                     # Static assets
```

Component architecture follows **atomic design** (atoms → molecules → organisms).

---

## Environment variables

See `.env.example` for the full list. Copy it to `.env.local` for local overrides.

| Variable               | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (sitemap, robots, JSON-LD) |

---

## Deployment

The project is platform-agnostic. To deploy on **Vercel**:

```bash
npx vercel
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).

For other platforms (Netlify, Cloudflare Pages, Docker), see Next.js [deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Notes

- **Tailwind v4** is configured via `@import "tailwindcss"` in `app/globals.css` — there is no `tailwind.config.js`.
- **Path alias** `@/*` maps to the project root (see `tsconfig.json`).
- See `AGENTS.md` for agent-specific conventions.
