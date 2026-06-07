import { requireAdmin } from "@/lib/auth";
import { listAdmins } from "@/lib/admins";
import { AddAdminForm } from "@/app/admin/_components/AddAdminForm";
import { RemoveAdminButton } from "@/app/admin/_components/RemoveAdminButton";

export const metadata = {
  title: "Admins — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminsPage() {
  const me = await requireAdmin();
  const admins = await listAdmins();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-h2 font-bold tracking-tight">Admins</h1>
      <p className="mt-1 text-body-sm text-[var(--fg-muted)]">
        Anyone listed here can sign in with their email + password. Share the password you set with
        each new admin. The last admin can&apos;t be removed.
      </p>

      <div className="mt-6 rounded-xl border border-[var(--border-default)] bg-white p-5">
        <AddAdminForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border-default)] bg-white">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-[var(--border-default)] bg-[var(--bg-surface-muted)] text-caption uppercase tracking-wide text-[var(--fg-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Added by</th>
              <th className="px-4 py-3 text-right font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {admins.map((a) => {
              const isSelf = a.email === me.email.toLowerCase();
              return (
                <tr key={a.id} className="hover:bg-[var(--bg-surface-muted)]">
                  <td className="px-4 py-3 font-medium">
                    {a.email}
                    {isSelf && (
                      <span className="ml-2 text-caption text-[var(--fg-muted)]">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{a.addedBy ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    {admins.length > 1 && !isSelf ? (
                      <RemoveAdminButton id={a.id} email={a.email} />
                    ) : (
                      <span className="text-caption text-[var(--fg-muted)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
