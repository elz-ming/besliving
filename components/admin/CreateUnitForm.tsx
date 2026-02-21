"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PROPERTY_TYPES = ["condo", "landed", "apartment", "studio", "serviced", "other"];

export function CreateUnitForm() {
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
      const res = await fetch("/api/admin/units", {
        method: "POST",
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
        throw new Error(err ?? "Failed to create unit");
      }
      const { id } = await res.json();
      router.push(`/admin/units/${id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]/20"
          placeholder="e.g. Sunset Condo, Penang"
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
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
          placeholder="e.g. Penang, KL"
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
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
          placeholder="Full address"
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
          className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none"
          placeholder="Describe the unit..."
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="is_published"
          name="is_published"
          type="checkbox"
          className="rounded border-[#e9e3f5] text-[#2ec4b6] focus:ring-[#2ec4b6]"
        />
        <label htmlFor="is_published" className="text-sm text-[#6b7280]">
          Publish (visible to public)
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#2ec4b6] py-3 font-semibold text-white hover:bg-[#1a9b8f] disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create unit"}
      </button>
    </form>
  );
}
