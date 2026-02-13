import { PropertyCard } from "@/components/PropertyCard";

const sampleProperties = [
  {
    id: "1",
    name: "Sunrise House",
    location: "Brooklyn, NY",
    price: "$1,200",
    rooms: 6,
    available: 2,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    amenities: ["WiFi", "Gym", "Rooftop"],
  },
  {
    id: "2",
    name: "Ocean View Loft",
    location: "San Francisco, CA",
    price: "$1,450",
    rooms: 4,
    available: 1,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    amenities: ["Parking", "Laundry", "Garden"],
  },
  {
    id: "3",
    name: "Green Garden Apartments",
    location: "Austin, TX",
    price: "$980",
    rooms: 8,
    available: 3,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    amenities: ["Pool", "BBQ", "Co-working"],
  },
  {
    id: "4",
    name: "Downtown Studios",
    location: "Chicago, IL",
    price: "$1,100",
    rooms: 5,
    available: 0,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    amenities: ["Concierge", "WiFi", "Storage"],
  },
];

export default function PropertiesPage() {
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
          {sampleProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </main>
  );
}
