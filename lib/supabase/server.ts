import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

/**
 * Server-side Supabase client with service role for admin operations.
 * Use for user sync, migrations, etc. Never expose to client.
 */
export function createServerSupabase() {
  if (!supabaseServiceKey) {
    console.warn(
      "SUPABASE_SERVICE_ROLE_KEY not set - user sync will fail. Add to .env.local"
    );
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY - required for user sync from Clerk"
    );
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}
