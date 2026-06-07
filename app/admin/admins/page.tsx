import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listAdmins } from "@/lib/admins";
import { AddAdminForm } from "@/app/admin/_components/AddAdminForm";
import { RemoveAdminButton } from "@/app/admin/_components/RemoveAdminButton";

export const metadata = {
  title: "Admins — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminsPage() {
  await requireAdmin();
  const admins = await listAdmins();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-h2 font-bold tracking-tight">Admins</h1>
      <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
        Anyone listed here can sign in to the admin. Permanent admins come from the server config
        and can&apos;t be removed here.
      </p>

      <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-white p-5">
        <AddAdminForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border-default)] bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] text-caption uppercase tracking-wide text-[var(--fg-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {admins.map((a) => (
              <tr key={a.id ?? `env:${a.email}`} className="hover:bg-[var(--bg-surface-muted)]">
                <td className="px-4 py-3 font-medium">{a.email}</td>
                <td className="px-4 py-3 text-[var(--fg-muted)]">
                  {a.source === "env" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck size={14} aria-hidden="true" />
                      Permanent
                    </span>
                  ) : a.addedBy ? (
                    `Added by ${a.addedBy}`
                  ) : (
                    "Added"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {a.source === "db" && a.id ? (
                    <RemoveAdminButton id={a.id} email={a.email} />
                  ) : (
                    <span className="text-caption text-[var(--fg-muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
