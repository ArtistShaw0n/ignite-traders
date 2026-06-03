import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Products table — will replace `data/products.json` in Phase 7.
 * For now (Phases 1–2), no code reads from this; the schema exists so
 * the FK from `inquiries.productId` is valid.
 */
export const products = pgTable(
  "products",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    categoryLabel: text("category_label").notNull(),
    categorySlug: text("category_slug").notNull(),
    description: text("description"),
    sizes: text("sizes")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    images: jsonb("images")
      .notNull()
      .default(sql`'[]'::jsonb`),
    badge: text("badge"),
    featured: boolean("featured").notNull().default(false),
    bestseller: boolean("bestseller").notNull().default(false),
    isProtectiveGown: boolean("is_protective_gown").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("products_slug_idx").on(t.slug),
    index("products_category_slug_idx").on(t.categorySlug),
    index("products_featured_idx").on(t.featured),
    index("products_bestseller_idx").on(t.bestseller),
  ],
);

/** Inquiry pipeline status. */
export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "replied",
  "quoted",
  "won",
  "lost",
]);

/**
 * Inquiries — every contact-form / quote-request submission.
 * Phase 2 writes here. Phase 6 (admin dashboard) reads + mutates.
 */
export const inquiries = pgTable(
  "inquiries",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    // Contact
    name: text("name").notNull(),
    company: text("company"),
    email: text("email").notNull(),
    phone: text("phone"),
    // Request
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    message: text("message").notNull(),
    quantity: integer("quantity"),
    // Pipeline
    status: inquiryStatusEnum("status").notNull().default("new"),
    source: text("source"), // 'home-hero' | 'contact-page' | 'product-page' | 'whatsapp-fallback'
    // Meta
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("inquiries_status_idx").on(t.status),
    index("inquiries_created_at_idx").on(t.createdAt.desc()),
    index("inquiries_email_idx").on(t.email),
  ],
);

/** Email delivery status (Resend webhook updates this). */
export const emailStatusEnum = pgEnum("email_status", [
  "queued",
  "sent",
  "delivered",
  "bounced",
  "failed",
]);

/**
 * Audit log of transactional emails. Wired in Phase 3 (Resend) and
 * Phase 9 (delivery-status webhook). Schema present from day 1 so we
 * don't need a migration to add it later.
 */
export const emailLog = pgTable("email_log", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  inquiryId: uuid("inquiry_id").references(() => inquiries.id, {
    onDelete: "cascade",
  }),
  toEmail: text("to_email").notNull(),
  template: text("template").notNull(),
  resendId: text("resend_id"),
  status: emailStatusEnum("status").notNull().default("queued"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---- Inferred types (use these everywhere instead of hand-writing) ----
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
export type EmailLog = typeof emailLog.$inferSelect;
export type NewEmailLog = typeof emailLog.$inferInsert;
