import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/db/user";

export default async function AdminPage() {
  const user = await getAppUser();
  if (!user) redirect("/auth");
  if (user.role !== "admin" && user.role !== "superadmin")
    redirect("/dashboard");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#1f2937]">Admin dashboard</h1>
        <p className="mt-1 text-[#6b7280]">BesLiving management</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Properties", value: "—" },
            { label: "Active Tenants", value: "—" },
            { label: "Waitlist", value: "—" },
            { label: "Revenue (MTD)", value: "—" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-[#e9e3f5] bg-white p-6 shadow-sm"
            >
              <p className="text-sm text-[#6b7280]">{card.label}</p>
              <p className="mt-2 text-xl font-semibold text-[#1f2937]">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-[#e9e3f5] bg-[#fef3c7]/50 p-6">
          <h3 className="font-semibold text-[#d4a017]">Quick actions</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/admin/properties"
              className="rounded-lg bg-[#f4d35e] px-4 py-2 text-sm font-medium text-[#1f2937] hover:bg-[#d4a017] hover:text-white"
            >
              Manage properties
            </a>
            <a
              href="/admin/users"
              className="rounded-lg border border-[#f4d35e] px-4 py-2 text-sm font-medium text-[#d4a017] hover:bg-[#fef3c7]"
            >
              View users
            </a>
            {user.role === "superadmin" && (
              <a
                href="/superadmin"
                className="rounded-lg bg-[#b19cd9] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b6cb8]"
              >
                Manage admins
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
