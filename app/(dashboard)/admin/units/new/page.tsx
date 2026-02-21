import Link from "next/link";
import { CreateUnitForm } from "@/components/admin/CreateUnitForm";

export default function NewUnitPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#fefefe]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/units"
          className="text-sm text-[#2ec4b6] hover:underline"
        >
          ← Back to units
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-[#1f2937]">Create unit</h1>
        <CreateUnitForm />
      </div>
    </main>
  );
}
