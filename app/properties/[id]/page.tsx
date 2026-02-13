import Link from "next/link";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
          <h1 className="text-3xl font-bold text-[#1f2937]">Sunrise House</h1>
          <p className="mt-2 text-[#6b7280]">Brooklyn, NY</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <span className="rounded-full bg-[#fef3c7] px-4 py-2 text-sm font-medium text-[#d4a017]">
              $1,200 / month
            </span>
            <span className="rounded-full bg-[#a7f3ec] px-4 py-2 text-sm font-medium text-[#1a9b8f]">
              2 rooms available
            </span>
          </div>
          <p className="mt-6 text-[#6b7280]">
            A vibrant co-living house in the heart of Brooklyn. Shared kitchen,
            rooftop access, and a tight-knit community of professionals.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-white hover:bg-[#1a9b8f]"
          >
            Apply to live here
          </Link>
        </div>
      </div>
    </main>
  );
}
