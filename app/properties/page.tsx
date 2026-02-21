import { PropertyCard } from "@/components/PropertyCard";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function PropertiesPage() {
  const supabase = createServerSupabase();
  const { data: properties } = await supabase
    .from("properties")
    .select("id, name, location, price_monthly_cents, rooms_total, rooms_available, image_url, amenities")
    .order("created_at", { ascending: false });

  const forCards = (properties ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    location: p.location,
    price: `$${(p.price_monthly_cents / 100).toLocaleString()}`,
    rooms: p.rooms_total,
    available: p.rooms_available,
    image: p.image_url ?? "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    amenities: p.amenities ?? [],
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fefefe] to-[#e9e3f5]/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#1f2937] sm:text-4xl">
            Find your perfect space
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Browse our curated co-living properties. All furnished, community-led,
            move-in ready.
          </p>
        </div>

        {/* Filters placeholder */}
        <div className="mb-8 flex flex-wrap gap-4">
          <select className="rounded-xl border border-[#e9e3f5] bg-white px-4 py-2 text-sm text-[#6b7280] focus:border-[#2ec4b6] focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]/20">
            <option>All locations</option>
          </select>
          <select className="rounded-xl border border-[#e9e3f5] bg-white px-4 py-2 text-sm text-[#6b7280] focus:border-[#2ec4b6] focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]/20">
            <option>Any budget</option>
          </select>
          <button className="rounded-xl border border-[#2ec4b6] bg-[#a7f3ec]/30 px-4 py-2 text-sm font-medium text-[#1a9b8f]">
            Apply filters
          </button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {forCards.length ? (
            forCards.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="col-span-full text-center text-[#6b7280]">
              No properties yet. Run <code className="rounded bg-[#e9e3f5] px-1">supabase db reset</code> to seed sample data.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
