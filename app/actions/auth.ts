"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

/** Sign in with email + password (Auth.js credentials). Returns an error
 *  message string, or redirects to /admin on success. */
export async function authenticate(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return null;
  } catch (err) {
    if (err instanceof AuthError) {
      return "Invalid email or password.";
    }
    // signIn's success path throws a redirect — let it propagate.
    throw err;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/admin/sign-in" });
}
