import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import Image from "next/image";

export default async function CataloguePage() {
  const supabase = createServerSupabase();
  const { data: units } = await supabase
    .from("units")
    .select(`
      id,
      title,
      property_type,
      city,
      address,
      is_published,
      rooms (
        id,
        price,
        availability_status
      )
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const { data: unitMedia } = units?.length
    ? await supabase
        .from("media")
        .select("unit_id, file_path")
        .in("unit_id", units.map((u) => u.id))
        .eq("media_type", "image")
    : { data: [] };

  const coverByUnit = (unitMedia ?? []).reduce<Record<string, string>>((acc, m) => {
    if (m.unit_id && !acc[m.unit_id]) acc[m.unit_id] = m.file_path;
    return acc;
  }, {});

  const getMinPrice = (rooms: { price: number }[] | null) => {
    if (!rooms?.length) return null;
    return Math.min(...rooms.map((r) => Number(r.price)));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fefefe] to-[#e9e3f5]/20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1f2937] sm:text-4xl">
          Browse units
        </h1>
        <p className="mt-2 text-[#6b7280]">
          Co-living spaces. Rent by room.
        </p>

        {!units?.length ? (
          <div className="mt-12 rounded-xl border border-[#e9e3f5] bg-white p-12 text-center">
            <p className="text-[#6b7280]">No published units yet. Check back soon.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {units.map((unit) => {
              const minPrice = getMinPrice(unit.rooms);
              const coverPath = coverByUnit[unit.id];
              const imgSrc = coverPath
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-media/${coverPath}`
                : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop";
              return (
                <Link key={unit.id} href={`/units/${unit.id}`}>
                  <article className="group overflow-hidden rounded-2xl border border-[#e9e3f5]/80 bg-white shadow-sm transition-all hover:border-[#b19cd9]/50 hover:shadow-lg">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#a7f3ec]/50 to-[#e9e3f5]">
                      <Image
                        src={imgSrc}
                        alt={unit.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={!!coverPath}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[#2ec4b6]">
                        {unit.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#6b7280]">{unit.city}</p>
                      {minPrice != null && (
                        <p className="mt-2 text-lg font-bold text-[#2ec4b6]">
                          From ${minPrice.toLocaleString()}/mo
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
