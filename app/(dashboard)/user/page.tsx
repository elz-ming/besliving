import Link from "next/link";

export default function UserDashboardPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#1f2937]">My dashboard</h1>
        <p className="mt-1 text-[#6b7280]">
          Your waitlist and rented rooms (coming soon)
        </p>

        <div className="mt-8 rounded-xl border border-[#e9e3f5] bg-[#a7f3ec]/20 p-8 text-center">
          <p className="text-[#6b7280]">Browse units and join waitlists.</p>
          <Link
            href="/catalogue"
            className="mt-4 inline-block rounded-lg bg-[#2ec4b6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a9b8f]"
          >
            Browse units
          </Link>
        </div>
      </div>
    </main>
  );
}
