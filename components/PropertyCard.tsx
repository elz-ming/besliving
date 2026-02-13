import Image from "next/image";
import Link from "next/link";

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  rooms: number;
  available: number;
  image: string;
  amenities: string[];
};

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`}>
      <article className="group overflow-hidden rounded-2xl border border-[#e9e3f5]/80 bg-white shadow-sm transition-all hover:border-[#b19cd9]/50 hover:shadow-lg hover:shadow-[#b19cd9]/10">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#a7f3ec]/50 to-[#e9e3f5]">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#2ec4b6] backdrop-blur">
            {property.available} available
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-[#1f2937] group-hover:text-[#2ec4b6]">
            {property.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[#6b7280]">
            <span>📍</span>
            {property.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {property.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-lg bg-[#e9e3f5]/60 px-2 py-0.5 text-xs text-[#8b6cb8]"
              >
                {a}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-[#2ec4b6]">
              {property.price}
              <span className="text-sm font-normal text-[#6b7280]">/mo</span>
            </span>
            <span className="text-sm text-[#6b7280]">
              {property.rooms} rooms total
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
