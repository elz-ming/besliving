import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditUnitForm } from "@/components/admin/EditUnitForm";
import { ManageRooms } from "@/components/admin/ManageRooms";

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { data: unit } = await supabase
    .from("units")
    .select("*")
    .eq("id", id)
    .single();

  if (!unit) notFound();

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, price, size_sqm, availability_status")
    .eq("unit_id", id)
    .order("name");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/admin/units" className="text-sm text-[#2ec4b6] hover:underline">
          ← Back to units
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-[#1f2937]">Edit unit</h1>
        <EditUnitForm unit={unit} />
        <ManageRooms unitId={id} rooms={rooms ?? []} />
      </div>
    </main>
  );
}
