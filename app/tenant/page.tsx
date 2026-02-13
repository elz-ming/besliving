import { DashboardLayout } from "@/components/DashboardLayout";

export default function TenantDashboard() {
  return (
    <DashboardLayout role="tenant" title="Tenant Dashboard">
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">
          Welcome back! 👋
        </h1>
        <p className="mt-1 text-[#6b7280]">Here&apos;s what&apos;s happening with your co-living.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Current Space", value: "Sunrise House", color: "turquoise" },
            { label: "Next Payment", value: "Mar 1, 2025", color: "purple" },
            { label: "Community Events", value: "3 this month", color: "yellow" },
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

        <div className="mt-8 rounded-xl border border-[#e9e3f5] bg-[#a7f3ec]/20 p-6">
          <h3 className="font-semibold text-[#1a9b8f]">Quick actions</h3>
          <div className="mt-4 flex gap-4">
            <a
              href="/properties"
              className="rounded-lg bg-[#2ec4b6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a9b8f]"
            >
              Book a tour
            </a>
            <a
              href="/tenant/payments"
              className="rounded-lg border border-[#2ec4b6] px-4 py-2 text-sm font-medium text-[#1a9b8f] hover:bg-[#a7f3ec]/30"
            >
              Pay rent
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
