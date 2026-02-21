import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAppUser } from "@/lib/db/user";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAppUser();
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, property_type, city, address, description, is_published } =
      body;

    if (!title || !property_type || !city || !address) {
      return NextResponse.json(
        { error: "title, property_type, city, address are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("units")
      .insert({
        title,
        property_type,
        city,
        address,
        description: description ?? null,
        is_published: is_published ?? false,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[admin units]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
