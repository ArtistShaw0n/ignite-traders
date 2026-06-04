import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Clerk middleware — gates /admin/* behind authentication.
 *
 * The sign-in page itself (/admin/sign-in) is inside the admin route group
 * so it shares the ClerkProvider, but is explicitly excluded from the
 * auth-required matcher so users can actually reach it.
 *
 * Email-allowlist enforcement (only specific addresses get past the
 * Clerk login) happens in `lib/auth.ts#requireAdmin`, which every admin
 * page calls before rendering.
 */
const isProtectedAdminRoute = createRouteMatcher([
  "/admin",
  "/admin/((?!sign-in).*)",
]);

/**
 * Clerk needs its keys at runtime. On Vercel (Production/Preview) they're
 * present so the real middleware runs. Locally — where the keys aren't
 * pulled into .env.local (the Clerk integration only syncs to Prod/Preview)
 * — clerkMiddleware would throw on EVERY request and take the whole dev
 * server down, including the public marketing site. So when the keys are
 * absent we fall back to a no-op pass-through. The /admin pages still won't
 * work locally without keys, but the rest of the site keeps running.
 */
const clerkConfigured =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedAdminRoute(req)) {
        await auth.protect();
      }
    })
  : function passthroughMiddleware() {
      // No Clerk keys in this environment — let every request through.
    };

export const config = {
  // Next.js convention — skip Next internals + static files, but always
  // run for API + trpc routes. Pulled from the Clerk docs example.
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
