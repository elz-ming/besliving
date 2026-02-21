import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/db/user";
import { createServerSupabase } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAppUser();
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, end_date } = body;

  const supabase = createServerSupabase();

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id, room_id, status")
    .eq("id", id)
    .single();

  if (!tenancy) {
    return NextResponse.json({ error: "Tenancy not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (end_date !== undefined) updates.end_date = end_date;

  const { data, error } = await supabase
    .from("tenancies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[tenancies update]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (status === "ended" && tenancy.room_id) {
    await supabase
      .from("rooms")
      .update({ availability_status: "available" })
      .eq("id", tenancy.room_id);
  }

  return NextResponse.json(data);
}
