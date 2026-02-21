import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Sync Clerk user to Supabase. Idempotent - safe to call on every request.
 * Call this before getAppUser() when the user may have just signed in.
 */
export async function syncUserToDb(userId: string): Promise<void> {
  const user = await currentUser();
  if (!user) return;

  const supabase = createServerSupabase();
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  const email = user.emailAddresses[0]?.emailAddress ?? null;
  const firstSuperadminEmail = process.env.FIRST_SUPERADMIN_EMAIL?.trim().toLowerCase();
  const isBootstrapSuperadmin =
    !!firstSuperadminEmail && email?.toLowerCase() === firstSuperadminEmail;

  const userPayload = {
    clerk_id: userId,
    email,
    full_name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
    avatar_url: user.imageUrl ?? null,
    last_sign_in_at: new Date().toISOString(),
  };

  if (existing) {
    const updatePayload = isBootstrapSuperadmin
      ? { ...userPayload, role: "superadmin" as const }
      : userPayload;
    await supabase.from("users").update(updatePayload).eq("id", existing.id);
  } else {
    const role = isBootstrapSuperadmin ? "superadmin" : "user";
    await supabase.from("users").insert({ ...userPayload, role });
  }
}
