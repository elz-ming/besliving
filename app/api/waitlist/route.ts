import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Join waitlist for a room.
 * Requires sign-in. Creates waitlist_registration or returns existing.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Sign in to join waitlist" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { room_id } = body;
    if (!room_id || typeof room_id !== "string") {
      return NextResponse.json(
        { error: "room_id is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();
    const { data: user } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "User not synced yet. Try again in a moment." },
        { status: 503 }
      );
    }

    // Check if already on waitlist
    const { data: existing } = await supabase
      .from("waitlist_registrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("room_id", room_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Already on waitlist", id: existing.id },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("waitlist_registrations")
      .insert({
        user_id: user.id,
        room_id,
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data?.id });
  } catch (err) {
    console.error("[waitlist]", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to join waitlist",
      },
      { status: 500 }
    );
  }
}
