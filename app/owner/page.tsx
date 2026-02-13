import { DashboardLayout } from "@/components/DashboardLayout";

export default function OwnerDashboard() {
  return (
    <DashboardLayout role="owner" title="Property Owner">
      <div>
        <h1 className="text-2xl font-bold text-[#1f2937]">
          Your properties
        </h1>
        <p className="mt-1 text-[#6b7280]">
          Manage listings, tenants, and earnings from one place.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Total Properties", value: "3", color: "purple" },
            { label: "Active Tenants", value: "8", color: "turquoise" },
            { label: "This Month&apos;s Earnings", value: "$9,600", color: "yellow" },
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

        <div className="mt-8 rounded-xl border border-[#e9e3f5] bg-[#e9e3f5]/40 p-6">
          <h3 className="font-semibold text-[#8b6cb8]">List a new property</h3>
          <p className="mt-2 text-sm text-[#6b7280]">
            Add your co-living space to BesLiving and reach thousands of
            prospective tenants.
          </p>
          <a
            href="/owner/properties/new"
            className="mt-4 inline-block rounded-lg bg-[#b19cd9] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b6cb8]"
          >
            Add property
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
