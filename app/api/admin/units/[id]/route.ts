import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAppUser } from "@/lib/db/user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getAppUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin"))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    const { title, property_type, city, address, description, is_published } = body;

    const supabase = createServerSupabase();
    const updates: Record<string, unknown> = {};
    if (title != null) updates.title = title;
    if (property_type != null) updates.property_type = property_type;
    if (city != null) updates.city = city;
    if (address != null) updates.address = address;
    if (description !== undefined) updates.description = description;
    if (is_published !== undefined) updates.is_published = is_published;

    const { error } = await supabase.from("units").update(updates).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin units patch]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
