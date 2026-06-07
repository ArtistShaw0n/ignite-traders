import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge-safe Auth.js middleware. The `authorized` callback in auth.config.ts
 * gates /admin/* and redirects signed-out users to /admin/sign-in. The
 * Credentials provider (DB + bcrypt) is NOT loaded here — middleware only
 * verifies the JWT session cookie.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
