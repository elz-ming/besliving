import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getAppUser } from "@/lib/db/user";
import { JoinWaitlistButton } from "@/components/JoinWaitlistButton";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  const user = await getAppUser();
  let onWaitlist = false;
  if (user && property) {
    const { data } = await supabase
      .from("waitlist_registrations")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", id)
      .single();
    onWaitlist = !!data;
  }

  if (!property) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Link
            href="/properties"
            className="text-sm text-[#2ec4b6] hover:underline"
          >
            ← Back to properties
          </Link>
          <p className="mt-8 text-[#6b7280]">Property not found.</p>
        </div>
      </main>
    );
  }

  const price = (property.price_monthly_cents / 100).toLocaleString();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/properties"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#2ec4b6]"
        >
          ← Back to properties
        </Link>
        <div className="rounded-2xl border border-[#e9e3f5] bg-gradient-to-br from-[#a7f3ec]/20 to-[#e9e3f5]/40 p-8">
          <h1 className="text-3xl font-bold text-[#1f2937]">
            {property.name}
          </h1>
          <p className="mt-2 text-[#6b7280]">{property.location}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="rounded-full bg-[#fef3c7] px-4 py-2 text-sm font-medium text-[#d4a017]">
              ${price} / month
            </span>
            <span className="rounded-full bg-[#a7f3ec] px-4 py-2 text-sm font-medium text-[#1a9b8f]">
              {property.rooms_available} rooms available
            </span>
          </div>
          <p className="mt-6 text-[#6b7280]">
            {property.description ??
              "A vibrant co-living space. Furnished, utilities included."}
          </p>
          <JoinWaitlistButton
            propertyId={property.id}
            alreadyOnWaitlist={onWaitlist}
          />
        </div>
      </div>
    </main>
  );
}
