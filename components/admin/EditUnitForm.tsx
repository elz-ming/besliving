"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROPERTY_TYPES = ["condo", "landed", "apartment", "studio", "serviced", "other"];

type Unit = {
  id: string;
  title: string;
  property_type: string;
  city: string;
  address: string;
  description: string | null;
  is_published: boolean;
};

export function EditUnitForm({ unit }: { unit: Unit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/admin/units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          property_type: formData.get("property_type"),
          city: formData.get("city"),
          address: formData.get("address"),
          description: formData.get("description") || null,
          is_published: formData.get("is_published") === "on",
        }),
      });
      if (!res.ok) {
        const { error: err } = await res.json();
        throw new Error(err ?? "Failed to update");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-xl border border-[#e9e3f5] bg-white p-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#1f2937]">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={unit.title}
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="property_type" className="block text-sm font-medium text-[#1f2937]">
          Property type
        </label>
        <select
          id="property_type"
          name="property_type"
          required
          defaultValue={unit.property_type}
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-[#1f2937]">
          City
        </label>
        <input
          id="city"
          name="city"
          required
          defaultValue={unit.city}
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#1f2937]">
          Address
        </label>
        <input
          id="address"
          name="address"
          required
          defaultValue={unit.address}
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#1f2937]">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={unit.description ?? ""}
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          defaultChecked={unit.is_published}
          className="rounded border-[#e9e3f5] text-[#2ec4b6] focus:ring-[#2ec4b6]"
        />
        <label htmlFor="is_published" className="text-sm text-[#6b7280]">
          Publish (visible to public)
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#2ec4b6] px-6 py-2 font-semibold text-white hover:bg-[#1a9b8f] disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
