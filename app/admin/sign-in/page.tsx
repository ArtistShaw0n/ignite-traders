import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { SignInForm } from "@/app/admin/_components/SignInForm";

export const metadata = {
  title: "Sign in — Admin",
  robots: { index: false, follow: false },
};

export default async function SignInPage() {
  const admin = await getAdminUser();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border-default)] bg-white p-8 shadow-sm">
        <h1 className="text-h3 font-bold tracking-tight">IGNITE Admin</h1>
        <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
          Sign in to manage products and categories.
        </p>
        <div className="mt-6">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
