import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Returns the current user's Clerk ID and their DB row (if any).
 * Use this to verify you're editing the correct row in Supabase when setting superadmin.
 * Go to /api/debug/me while signed in, then update the users row where clerk_id matches.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ clerkId: null, dbUser: null });
  }

  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("users")
    .select("id, clerk_id, email, full_name, role")
    .eq("clerk_id", userId)
    .single();

  return NextResponse.json({
    clerkId: userId,
    dbUser: data,
    help: data
      ? "In Supabase Table Editor → users, find the row with clerk_id = clerkId above. Set role to 'superadmin' for superadmin access."
      : "No DB row yet. Sign in again and refresh - UserSync should create your row. Then set role to 'superadmin' in Supabase.",
  });
}
