import { DashboardLayout } from "@/components/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Admin">
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">
          Platform overview
        </h1>
        <p className="mt-1 text-[#6b7280]">
          Manage properties, users, and platform health.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Properties", value: "52" },
            { label: "Active Tenants", value: "312" },
            { label: "Property Owners", value: "28" },
            { label: "Revenue (MTD)", value: "$124K" },
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[#e9e3f5] bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-[#1f2937]">Recent activity</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#6b7280]">
              <li>New tenant: Jane D. → Sunrise House</li>
              <li>Payment received: John M. — $1,200</li>
              <li>Property listed: Ocean View Loft</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[#e9e3f5] bg-[#fef3c7]/50 p-6 shadow-sm">
            <h3 className="font-semibold text-[#d4a017]">Manager actions</h3>
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
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
