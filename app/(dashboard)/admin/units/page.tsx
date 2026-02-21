import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminUnitsPage() {
  const supabase = createServerSupabase();
  const { data: units } = await supabase
    .from("units")
    .select(`
      id,
      title,
      city,
      is_published,
      created_at,
      rooms (id)
    `)
    .order("created_at", { ascending: false });

  const roomsCount = (u: { rooms: { id: string }[] | null }) =>
    u.rooms?.length ?? 0;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1f2937]">Units</h1>
            <p className="mt-1 text-[#6b7280]">Manage listing units</p>
          </div>
          <Link
            href="/admin/units/new"
            className="rounded-lg bg-[#2ec4b6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1a9b8f]"
          >
            Create unit
          </Link>
        </div>

        {!units?.length ? (
          <div className="mt-8 rounded-xl border border-[#e9e3f5] bg-white p-12 text-center">
            <p className="text-[#6b7280]">No units yet.</p>
            <Link
              href="/admin/units/new"
              className="mt-4 inline-block text-sm font-medium text-[#2ec4b6] hover:underline"
            >
              Create your first unit
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-xl border border-[#e9e3f5] bg-white">
            <table className="min-w-full divide-y divide-[#e9e3f5]">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-[#6b7280]">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-[#6b7280]">
                    City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-[#6b7280]">
                    Published
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-[#6b7280]">
                    Rooms
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase text-[#6b7280]">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase text-[#6b7280]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9e3f5]">
                {(units ?? []).map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 font-medium text-[#1f2937]">
                      {u.title}
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">{u.city}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          u.is_published
                            ? "bg-[#a7f3ec] text-[#1a9b8f]"
                            : "bg-[#e9e3f5] text-[#8b6cb8]"
                        }`}
                      >
                        {u.is_published ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#6b7280]">
                      {roomsCount(u)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6b7280]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/units/${u.id}/edit`}
                        className="text-sm font-medium text-[#2ec4b6] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
