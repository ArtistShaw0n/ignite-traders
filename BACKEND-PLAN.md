# IGNITE Traders — Backend Architecture Plan

> **Status:** Draft — under review (not yet implemented)
> **Goal:** Convert the marketing-only site into a fully functional B2B lead-capture + admin platform.
> **Authored:** 2026-06-03 (Office Mac session)

---

## 1. Scope summary

The current site is a 5-page marketing brochure. This plan adds:

1. **Working contact / quote forms** that submit to the server (not just `mailto:`).
2. **Database** to persist every inquiry with status tracking.
3. **Transactional emails** — admin notification + user auto-reply.
4. **Admin dashboard** behind authentication — view, filter, update, export inquiries.
5. **Product CMS** — replace `data/products.json` editing with a UI (CRUD + image upload).
6. **Analytics + lead-source tracking** baseline.

End state: a B2B lead pipeline that runs end-to-end without code edits to manage day-to-day operations.

---

## 2. Recommended tech stack

All choices are Vercel-native or Vercel-Marketplace integrations — zero custom infra.

| Concern | Pick | Why |
|---|---|---|
| **Database** | **Neon Postgres** (Vercel Marketplace) | Serverless, branching, generous free tier (0.5 GB). Vercel Postgres no longer exists; Neon is the recommended replacement. |
| **ORM** | **Drizzle ORM** | Type-safe, lightweight, fast on Edge/Fluid Compute, no codegen at runtime. Better fit for App Router than Prisma. |
| **Auth** | **Clerk** (Vercel Marketplace) | Native Marketplace integration → auto-provisioned env vars. Built-in admin-only access pattern via middleware. Free up to 10K MAU. |
| **Email** | **Resend** | Built by Vercel ecosystem folks; React Email templates; 100/day free, 3K/month. |
| **Image storage** | **Vercel Blob** | Public + private support (per session reminder). Auto-CDN. No bucket config. |
| **Forms (client)** | **React Hook Form + Zod** | Standard, type-safe, integrates with Server Actions. |
| **Server logic** | **Next.js Server Actions** | Native App Router pattern; no separate `app/api/` routes needed for our use cases. |
| **Admin tables** | **TanStack Table** | Sort/filter/paginate inquiries — flexible, headless. |
| **Validation** | **Zod** (shared client + server) | One source of truth for form + server validation. |

### Not chosen, on purpose
- ❌ **Prisma** — heavier; codegen + binary engine complicates Vercel cold starts. Drizzle ORM is lighter.
- ❌ **NextAuth/Auth.js** — works, but Clerk's Marketplace integration is one-click; less to wire.
- ❌ **API Routes for forms** — Server Actions are simpler and just as performant on Fluid Compute.
- ❌ **Custom S3 / Cloudflare R2** — Vercel Blob is one click; no IAM setup.

---

## 3. Data model (Drizzle schema)

Three core tables. Admin users handled entirely by Clerk (no `users` table here).

### `inquiries`
Every contact-form / quote-request submission lands here.

```ts
inquiries {
  id            uuid          primary key, default random()
  // contact
  name          text          not null
  company       text          nullable
  email         text          not null
  phone         text          nullable
  // request
  productId     uuid          nullable, references products(id) on delete set null
  message       text          not null
  quantity      integer       nullable   // optional, for quote requests
  // pipeline
  status        enum          default 'new'   // new | replied | quoted | won | lost
  source        text          nullable   // 'home-hero' | 'contact-page' | 'product-page' | 'whatsapp-fallback'
  // meta
  ipHash        text          nullable   // for basic spam dedup (hashed, not raw IP)
  userAgent     text          nullable
  createdAt     timestamp     default now()
  updatedAt     timestamp     default now()
}
```

Indexes: `(status)`, `(createdAt desc)`, `(email)`.

### `products`
Replaces `data/products.json` once Phase 7 lands. JSON stays as the source until then; a one-time migration script seeds the table.

```ts
products {
  id              uuid          primary key
  slug            text          unique, not null
  title           text          not null
  categoryLabel   text          not null
  categorySlug    text          not null
  description     text          nullable
  sizes           text[]        default []
  images          jsonb         default []   // [{ url, alt, isPrimary }]
  badge           text          nullable
  featured        boolean       default false
  bestseller      boolean       default false
  isProtectiveGown boolean      default false
  sortOrder       integer       default 0
  createdAt       timestamp     default now()
  updatedAt       timestamp     default now()
}
```

Indexes: `(slug)`, `(categorySlug)`, `(featured)`, `(bestseller)`.

### `emailLog` (optional, recommended)
Audit trail for every transactional email we send.

```ts
emailLog {
  id          uuid          primary key
  inquiryId   uuid          references inquiries(id) on delete cascade
  to          text          not null
  template    text          not null   // 'admin-notification' | 'user-confirmation' | 'admin-reply'
  resendId    text          nullable   // Resend's message id, for status webhooks
  status      enum          default 'queued'  // queued | sent | delivered | bounced | failed
  error       text          nullable
  createdAt   timestamp     default now()
}
```

---

## 4. File structure (added directories highlighted)

```
ignite-traders/
├── app/
│   ├── (marketing)/                      ← existing
│   │   ├── page.tsx
│   │   ├── contact/page.tsx              ← updated: real form
│   │   └── products/[slug]/page.tsx      ← updated: quote form per product
│   ├── (admin)/                          ← NEW — protected route group
│   │   ├── layout.tsx                    ← Clerk gate + admin nav
│   │   ├── dashboard/page.tsx            ← inquiries summary
│   │   ├── inquiries/
│   │   │   ├── page.tsx                  ← list + filter + bulk actions
│   │   │   └── [id]/page.tsx             ← detail + status timeline
│   │   ├── products/
│   │   │   ├── page.tsx                  ← list
│   │   │   ├── new/page.tsx              ← create
│   │   │   └── [slug]/edit/page.tsx      ← edit
│   │   └── sign-in/[[...sign-in]]/page.tsx ← Clerk sign-in
│   ├── api/                              ← NEW — only for webhooks
│   │   └── webhooks/
│   │       └── resend/route.ts           ← Resend delivery status updates
│   └── actions/                          ← NEW — Server Actions namespace
│       ├── inquiries.ts                  ← submitInquiry, updateStatus, etc.
│       └── products.ts                   ← createProduct, updateProduct, deleteProduct, uploadImage
├── components/
│   ├── organisms/
│   │   ├── ContactForm.tsx               ← NEW
│   │   ├── ProductQuoteForm.tsx          ← NEW
│   │   ├── admin/                        ← NEW — admin-only organisms
│   │   │   ├── InquiriesTable.tsx
│   │   │   ├── InquiryStatusBadge.tsx
│   │   │   ├── ProductsTable.tsx
│   │   │   └── ProductForm.tsx
│   │   └── ...existing
│   └── ...
├── db/                                   ← NEW — Drizzle setup
│   ├── schema.ts                         ← all table definitions
│   ├── client.ts                         ← drizzle() instance
│   ├── migrations/                       ← auto-generated
│   └── seed.ts                           ← one-time products.json → DB
├── emails/                               ← NEW — React Email templates
│   ├── admin-notification.tsx
│   ├── user-confirmation.tsx
│   └── components/                       ← shared email partials
├── lib/
│   ├── email.ts                          ← NEW — sendEmail wrapper around Resend
│   ├── auth.ts                           ← NEW — requireAdmin() helper
│   ├── validation/                       ← NEW — shared Zod schemas
│   │   ├── inquiry.ts
│   │   └── product.ts
│   └── ...existing
├── middleware.ts                         ← NEW — Clerk + admin guard
└── drizzle.config.ts                     ← NEW — Drizzle CLI config
```

---

## 5. Authentication strategy

**Clerk** handles all admin auth. No custom session/JWT code.

### Access tiers
| Route | Required |
|---|---|
| `app/(marketing)/**` | Anonymous OK |
| `app/(admin)/sign-in/**` | Anonymous OK (the login page itself) |
| `app/(admin)/**` (everything else) | Signed in **AND** in the `admin` role |
| `app/actions/products.ts` mutations | `admin` role |
| `app/actions/inquiries.ts` `updateStatus` | `admin` role |
| `app/actions/inquiries.ts` `submitInquiry` | Public (the form submission) |

### Middleware (sketch)
```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/dashboard(.*)', '/inquiries(.*)', '/products/(.*)']);
const isAdminApi = createRouteMatcher(['/api/admin/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) || isAdminApi(req)) {
    await auth.protect((has) => has({ role: 'admin' }));
  }
});
```

### Admin onboarding
1. Owner signs up via Clerk hosted sign-in.
2. Owner manually assigns `admin` role in Clerk dashboard (one-time).
3. Optional: auto-grant `admin` to the first user via a one-shot script.

---

## 6. Email flows (Resend)

Every form submission triggers two emails. Both use React Email templates so styling matches the brand.

### A. Contact form / Quote request submitted

1. **Admin notification** → `ADMIN_EMAIL` env var
   - Subject: `[IGNITE Lead] {productTitle ?? "General inquiry"} — {name} ({company})`
   - Body: all submitted fields + a direct link to the admin inquiry page.
2. **User confirmation** → submitter's email
   - Subject: `We received your inquiry — IGNITE Traders`
   - Body: brief thank-you + expected response time + WhatsApp link.

### B. (Optional, Phase 9) Resend delivery webhook → `emailLog`
`/api/webhooks/resend` updates `emailLog.status` on `delivered` / `bounced` events.

### Failure handling
If Resend errors, the form still succeeds (inquiry is saved). A background retry queue (Vercel Queues, public beta) could be added later, but the simpler v1 is: log the failure to `emailLog`, surface in admin UI.

---

## 7. Storage — product images (Vercel Blob)

- Bucket auto-provisioned via `vercel blob` integration.
- Server Action `uploadProductImage(file: File)` returns a public URL.
- Public for product images, private mode reserved for any future admin-only assets.
- Image URLs stored in `products.images` JSON column (`{ url, alt, isPrimary }`).
- `next/image` `remotePatterns` updated to allow the Blob hostname.

---

## 8. Environment variables

Added to Vercel (Production + Preview + Development):

| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Auto by Neon integration | Pooled connection string |
| `DATABASE_URL_UNPOOLED` | Auto by Neon integration | For migrations |
| `CLERK_PUBLISHABLE_KEY` | Auto by Clerk Marketplace | Public |
| `CLERK_SECRET_KEY` | Auto by Clerk Marketplace | Secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Manual | `/sign-in` |
| `RESEND_API_KEY` | Manual (Resend dashboard) | |
| `RESEND_FROM_EMAIL` | Manual | e.g. `no-reply@ignitetradesbd.com` (needs domain verification) |
| `ADMIN_EMAIL` | Manual | Where inquiry notifications go |
| `BLOB_READ_WRITE_TOKEN` | Auto by Vercel Blob | Secret |
| `NEXT_PUBLIC_SITE_URL` | Existing | Already set |

Pulled locally via `vercel env pull .env.local`.

---

## 9. Implementation phases

Each phase is a self-contained PR — testable + deployable on its own. Phases are ordered so the site keeps working through each step.

| # | Phase | What gets built | Outcome |
|---|---|---|---|
| 1 | **DB foundation** | Neon Postgres provisioned, Drizzle schema, migration runner, `db:generate`/`db:migrate` scripts | Empty DB ready |
| 2 | **Contact form MVP** | Server Action `submitInquiry` writes to `inquiries`; new `ContactForm` organism on `/contact`; basic spam protection (honeypot + rate limit) | Real form submissions land in DB |
| 3 | **Email notifications** | Resend wired; `admin-notification` + `user-confirmation` React Email templates; sends fire on submit | Owner gets emailed every inquiry |
| 4 | **Per-product quote form** | `ProductQuoteForm` organism on product detail page; passes `productId` + `quantity` to `submitInquiry` | Product-page inquiries linked to the product |
| 5 | **Admin auth gate** | Clerk integration installed; `middleware.ts`; `(admin)` route group; empty dashboard placeholder | Only admins can see admin pages |
| 6 | **Admin inquiries dashboard** | List + filter + status update + detail view + CSV export | Day-to-day lead management works |
| 7 | **Products migration** | `seed.ts` ports `data/products.json` → DB; marketing pages now read from DB via cached query (`use cache`) | DB is source of truth for catalog |
| 8 | **Product CMS** | Admin CRUD for products; image upload to Vercel Blob; preview | Add/edit products without touching JSON |
| 9 | **Email log + webhook** (optional) | `emailLog` table; Resend webhook updates status; admin UI shows delivery state | Visibility into email deliverability |
| 10 | **Analytics + polish** | Vercel Analytics enabled; lead-source tracking via `source` column; basic conversion dashboard | Numbers to optimize against |

**Estimated effort:** 1 focused session per phase for Phases 1–6, slightly more for 7–10. Total ~10 sessions if done deliberately.

---

## 10. Open questions (need your call before Phase 1)

| # | Question | Default if no answer |
|---|---|---|
| Q1 | Domain for sender email — `no-reply@ignitetradesbd.com` ok? Needs DNS verification on Resend. | Use Resend's onboarding domain initially; switch to brand domain in Phase 3 |
| Q2 | Who's the first admin? (Clerk needs an email to assign `admin` role.) | `shawon221b@gmail.com` (the one in CLAUDE.md context) |
| Q3 | Spam strategy — honeypot only, or also reCAPTCHA / Vercel BotID? | Honeypot + rate limit in Phase 2; revisit if abuse surfaces |
| Q4 | Inquiry retention — keep forever, or auto-archive after N months? | Keep forever; add archived flag later |
| Q5 | Multi-admin support? | Yes — anyone with Clerk `admin` role |
| Q6 | Bangla content for confirmation emails? | English only v1; add Bangla template Phase 9 |

---

## 11. Cost estimate (monthly)

All within free tiers for expected traffic:

| Service | Free tier | Likely usage | Cost |
|---|---|---|---|
| Vercel (Hobby) | 100 GB bandwidth, unlimited deploys | Low | **$0** |
| Neon Postgres | 0.5 GB storage, autoscaling | <100 MB | **$0** |
| Clerk | 10K MAU | <10 admin users | **$0** |
| Resend | 3K emails/month | <500 | **$0** |
| Vercel Blob | 0.5 GB storage, 1 GB bandwidth | Few hundred MB of product images | **$0** |
| **Total v1** | | | **$0** |

When/if it grows past free tiers: ~$20/mo Neon Pro + ~$25/mo Clerk Pro + ~$20/mo Resend Pro = **~$65/mo** for a comfortable scale.

---

## 12. Risks + mitigations

| Risk | Mitigation |
|---|---|
| **Spam form submissions** | Honeypot field, IP-hash rate limit (1/min), Vercel BotID if abuse |
| **Lost inquiries during email outage** | DB write happens first; email is fire-and-forget with retry log |
| **Admin lockout** (Clerk down) | Resend doesn't depend on Clerk; emails still arrive. Read-only DB access via Neon dashboard as fallback |
| **Schema migrations on deployed DB** | Use Neon branching: every preview deployment gets a branched DB; main only migrates after PR merge |
| **Image hotlinking / bandwidth abuse** | `next/image` + Vercel's automatic optimization. Set max image size in upload validation |
| **GDPR / data privacy** | Hash IPs, don't store raw IPs; add explicit consent checkbox on form; document retention policy |

---

## 13. What we are NOT building (explicit non-goals v1)

- ❌ Customer-facing accounts / login (B2B inquiry-driven, not account-driven)
- ❌ Shopping cart / checkout / payments
- ❌ Order management beyond the inquiry pipeline
- ❌ Inventory tracking
- ❌ Multi-language UI (English only for now)
- ❌ Mobile app
- ❌ Bulk pricing engine (handled manually by the team responding to inquiries)

These can come later if the business needs them.

---

## 14. Next steps (once this plan is approved)

1. ✋ **Owner reviews & answers** the 6 questions in §10.
2. ☑️ **Phase 1 kickoff** — provision Neon + write Drizzle schema. Estimated 1 session.
3. After each phase merges, the live site keeps working — no big-bang cutover.

---

*Last updated: 2026-06-03 by Claude Code session.*
