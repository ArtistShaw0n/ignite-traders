import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign in — Admin",
  robots: { index: false, follow: false },
};

/**
 * Custom-hosted Clerk sign-in. The `[[...sign-in]]` catch-all is the
 * pattern Clerk expects so its internal flows (forgot password, etc.)
 * all resolve to the same page.
 */
export default function SignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SignIn
        path="/admin/sign-in"
        forceRedirectUrl="/admin"
        fallbackRedirectUrl="/admin"
        appearance={{
          elements: {
            rootBox: "shadow-none",
            card: "shadow-lg border border-[var(--border-default)]",
          },
        }}
      />
    </div>
  );
}
