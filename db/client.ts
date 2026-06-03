import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Drizzle client for Neon Postgres.
 *
 * Uses Neon's HTTP driver — optimised for Vercel Fluid Compute (no
 * persistent connections, no pool warmup). For long-running workloads
 * (background jobs, listen/notify) we'd swap to the WebSocket driver,
 * but every query in this app is request-scoped.
 *
 * Lazy connection: we only resolve DATABASE_URL on first query, so
 * `next build` succeeds in environments where the env var hasn't been
 * provisioned yet (e.g. CI building a PR preview before Vercel injects
 * Neon's connection string).
 */
type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

let cached: DrizzleClient | null = null;

function getDb(): DrizzleClient {
  if (cached) return cached;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Install Neon Postgres via the Vercel Marketplace, then `vercel env pull .env.local`.",
    );
  }

  const sql = neon(databaseUrl);
  cached = drizzle(sql, { schema });
  return cached;
}

/**
 * Proxy that defers connection setup until the first property access.
 * Callers use it exactly like a Drizzle client — `db.insert(...)`,
 * `db.select()`, `db.query.inquiries...` — without knowing it's lazy.
 */
export const db = new Proxy({} as DrizzleClient, {
  get(_target, prop, receiver) {
    const real = getDb();
    return Reflect.get(real, prop, receiver);
  },
});

export type Db = DrizzleClient;
export { schema };
