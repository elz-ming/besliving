import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Sync Clerk user to Supabase.
 * - If user exists (by clerk_id): sign in - update last_sign_in_at
 * - If user does not exist: sign up - insert new user
 */
export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabase();

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    const userPayload = {
      clerk_id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? null,
      full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      avatar_url: user.imageUrl ?? null,
      last_sign_in_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from("users").update(userPayload).eq("id", existing.id);
      return NextResponse.json({ action: "sign_in", id: existing.id });
    } else {
      const { data: inserted, error } = await supabase
        .from("users")
        .insert({ ...userPayload, role: "user" })
        .select("id")
        .single();

      if (error) throw error;
      return NextResponse.json({ action: "sign_up", id: inserted?.id });
    }
  } catch (err) {
    console.error("[user sync]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
