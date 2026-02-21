import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/db/user";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const user = await getAppUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const { data: tenancies, error } = await supabase
    .from("tenancies")
    .select(`
      id, start_date, end_date, status, created_at, tenant_id, room_id,
      rooms (id, name, price, unit_id, units (id, title, city))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[tenancies]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tenantIds = [...new Set((tenancies ?? []).map((t) => t.tenant_id).filter(Boolean))];
  const { data: users } = tenantIds.length
    ? await supabase.from("users").select("id, full_name, email").in("id", tenantIds)
    : { data: [] };
  const userMap = (users ?? []).reduce<Record<string, { full_name: string | null; email: string | null }>>(
    (acc, u) => {
      acc[u.id] = { full_name: u.full_name, email: u.email };
      return acc;
    },
    {}
  );

  const enriched = (tenancies ?? []).map((t) => ({
    ...t,
    tenant: t.tenant_id ? userMap[t.tenant_id] ?? null : null,
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const user = await getAppUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tenant_id, room_id, start_date, end_date } = body;

  if (!tenant_id || !room_id || !start_date) {
    return NextResponse.json(
      { error: "tenant_id, room_id, start_date required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabase();

  const { data: room } = await supabase
    .from("rooms")
    .select("id, availability_status")
    .eq("id", room_id)
    .single();

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (room.availability_status !== "available") {
    return NextResponse.json(
      { error: "Room is not available" },
      { status: 400 }
    );
  }

  const { data: tenancy, error } = await supabase
    .from("tenancies")
    .insert({
      tenant_id,
      room_id,
      start_date,
      end_date: end_date || null,
      status: "active",
    })
    .select("id, start_date, end_date, status, tenant_id, room_id")
    .single();

  if (error) {
    console.error("[tenancies create]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("rooms")
    .update({ availability_status: "occupied" })
    .eq("id", room_id);

  return NextResponse.json(tenancy);
}
