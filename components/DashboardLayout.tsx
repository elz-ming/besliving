import Link from "next/link";

type DashboardLayoutProps = {
  role: "tenant" | "owner" | "admin";
  title: string;
  children: React.ReactNode;
};

const roleConfig = {
  tenant: {
    links: [
      { href: "/tenant", label: "Overview" },
      { href: "/tenant/booking", label: "My Bookings" },
      { href: "/tenant/payments", label: "Payments" },
      { href: "/tenant/community", label: "Community" },
    ],
    color: "turquoise",
  },
  owner: {
    links: [
      { href: "/owner", label: "Overview" },
      { href: "/owner/properties", label: "My Properties" },
      { href: "/owner/tenants", label: "Tenants" },
      { href: "/owner/earnings", label: "Earnings" },
    ],
    color: "purple",
  },
  admin: {
    links: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/properties", label: "All Properties" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/reports", label: "Reports" },
    ],
    color: "yellow",
  },
};

export function DashboardLayout({
  role,
  title,
  children,
}: DashboardLayoutProps) {
  const config = roleConfig[role];
  const accent =
    config.color === "turquoise"
      ? "border-[#2ec4b6] text-[#2ec4b6] hover:bg-[#a7f3ec]/30"
      : config.color === "purple"
        ? "border-[#b19cd9] text-[#8b6cb8] hover:bg-[#e9e3f5]"
        : "border-[#f4d35e] text-[#d4a017] hover:bg-[#fef3c7]";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <aside className="w-56 border-r border-[#e9e3f5] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#1f2937]">{title}</h2>
        <nav className="mt-6 space-y-1">
          {config.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg border-l-4 px-4 py-2 text-sm font-medium ${accent}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
