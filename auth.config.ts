import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (no DB / bcrypt) — shared with the middleware.
 * The Credentials provider, which needs Node (DB + bcrypt), is added in auth.ts.
 */
export const authConfig = {
  pages: { signIn: "/admin/sign-in" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7-day sessions
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      // The sign-in page itself must stay reachable while signed out.
      if (path.startsWith("/admin/sign-in")) return true;
      if (path.startsWith("/admin")) return !!auth?.user;
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
