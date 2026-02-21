import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/db/user";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const user = await getAppUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("room_id");

  const supabase = createServerSupabase();
  let query = supabase
    .from("waitlist_registrations")
    .select(`
      id, user_id, room_id, property_id, status, created_at,
      rooms (id, name, unit_id, units (id, title, city))
    `)
    .order("created_at", { ascending: false });

  if (roomId) {
    query = query.eq("room_id", roomId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[waitlist admin]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const entries = data ?? [];
  const userIds = [...new Set(entries.map((e) => e.user_id).filter(Boolean))];
  const { data: users } = userIds.length
    ? await supabase.from("users").select("id, full_name, email").in("id", userIds)
    : { data: [] };
  const userMap = (users ?? []).reduce<
    Record<string, { full_name: string | null; email: string | null }>
  >((acc, u) => {
    acc[u.id] = { full_name: u.full_name, email: u.email };
    return acc;
  }, {});

  const enriched = entries.map((e) => ({
    ...e,
    users: e.user_id ? userMap[e.user_id] ?? null : null,
  }));

  return NextResponse.json(enriched);
}
