import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#1f2937]">Admin dashboard</h1>
        <p className="mt-1 text-[#6b7280]">BesLiving management</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Link
            href="/admin/units"
            className="rounded-xl border border-[#e9e3f5] bg-white p-6 shadow-sm transition-all hover:border-[#b19cd9] hover:shadow-md"
          >
            <h2 className="font-semibold text-[#1f2937]">Units</h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              Create and manage listing units
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-[#2ec4b6]">
              Manage units →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
