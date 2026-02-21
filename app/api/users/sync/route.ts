import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { syncUserToDb } from "@/lib/db/sync-user";

/**
 * Sync Clerk user to Supabase.
 * - If user exists (by clerk_id): sign in - update last_sign_in_at
 * - If user does not exist: sign up - insert new user
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await syncUserToDb(userId);

    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    return NextResponse.json({ action: "sync", id: data?.id });
  } catch (err) {
    console.error("[user sync]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
