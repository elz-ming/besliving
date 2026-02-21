import { redirect } from "next/navigation";
import { getAppUser } from "@/lib/db/user";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export default async function UserDashboardPage() {
  const user = await getAppUser();
  if (!user) redirect("/auth");

  const supabase = createServerSupabase();
  const { data: waitlist } = await supabase
    .from("waitlist_registrations")
    .select(
      `
      id,
      status,
      created_at,
      properties (
        id,
        name,
        location,
        price_monthly_cents,
        rooms_available
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-[#1f2937]">
          My waitlist
        </h1>
        <p className="mt-1 text-[#6b7280]">
          Rooms and units you&apos;ve registered interest in
        </p>

        {!waitlist?.length ? (
          <div className="mt-8 rounded-xl border border-[#e9e3f5] bg-[#a7f3ec]/20 p-8 text-center">
            <p className="text-[#6b7280]">You haven&apos;t joined any waitlists yet.</p>
            <Link
              href="/properties"
              className="mt-4 inline-block rounded-lg bg-[#2ec4b6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a9b8f]"
            >
              Browse properties
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {(waitlist ?? []).map((w) => {
              const prop = Array.isArray(w.properties)
                ? w.properties[0]
                : w.properties;
              return (
                <li
                  key={w.id}
                  className="rounded-xl border border-[#e9e3f5] bg-white p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1f2937]">
                        {prop?.name ?? "Unknown"}
                      </h3>
                      <p className="text-sm text-[#6b7280]">
                        {prop?.location} · ${((prop?.price_monthly_cents ?? 0) / 100).toLocaleString()}/mo
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                          w.status === "pending"
                            ? "bg-[#fef3c7] text-[#d4a017]"
                            : w.status === "offered"
                              ? "bg-[#a7f3ec] text-[#1a9b8f]"
                              : "bg-[#e9e3f5] text-[#8b6cb8]"
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <Link
                      href={`/properties/${prop?.id}`}
                      className="text-sm font-medium text-[#2ec4b6] hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
