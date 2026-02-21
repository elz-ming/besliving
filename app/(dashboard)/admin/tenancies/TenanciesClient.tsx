"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Tenancy = {
  id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  tenant_id: string;
  room_id: string | null;
  rooms: unknown;
  tenant: { full_name: string | null; email: string | null } | null;
};

function getRoomDisplay(rooms: unknown): string {
  if (!rooms || typeof rooms !== "object") return "—";
  const r = rooms as { name?: string; units?: { title?: string } | { title?: string }[] };
  const units = Array.isArray(r.units) ? r.units[0] : r.units;
  return `${units?.title ?? "—"} / ${r.name ?? "—"}`;
}

type Room = {
  id: string;
  name: string;
  units?: unknown;
};

type User = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export function TenanciesClient({
  tenancies,
  availableRooms,
  users,
}: {
  tenancies: Tenancy[];
  availableRooms: Room[];
  users: User[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tenant_id: "",
    room_id: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: "",
  });

  const active = tenancies.filter((t) => t.status === "active");
  const ended = tenancies.filter((t) => t.status === "ended" || t.status === "cancelled");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tenancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: form.tenant_id,
          room_id: form.room_id,
          start_date: form.start_date,
          end_date: form.end_date || null,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        alert(error || "Failed");
        return;
      }
      setShowForm(false);
      setForm({ tenant_id: "", room_id: "", start_date: new Date().toISOString().slice(0, 10), end_date: "" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleEndTenancy(id: string) {
    if (!confirm("End this tenancy? Room will become available.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tenancies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ended" }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        alert(error || "Failed");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create tenancy</CardTitle>
          <CardDescription>Assign a user to an available room</CardDescription>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">User</label>
                <select
                  value={form.tenant_id}
                  onChange={(e) => setForm((f) => ({ ...f, tenant_id: e.target.value }))}
                  required
                  className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || u.email || u.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Room</label>
                <select
                  value={form.room_id}
                  onChange={(e) => setForm((f) => ({ ...f, room_id: e.target.value }))}
                  required
                  className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Select room</option>
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {getRoomDisplay({ name: r.name, units: r.units })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Start date</label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">End date (optional)</label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating…" : "Create tenancy"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setShowForm(true)}>+ Create tenancy</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active tenancies</CardTitle>
          <CardDescription>{active.length} active</CardDescription>
        </CardHeader>
        <CardContent>
          {!active.length ? (
            <p className="text-[#6b7280]">No active tenancies</p>
          ) : (
            <ul className="space-y-3">
              {active.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-[#e9e3f5] p-4"
                >
                  <div>
                    <p className="font-medium">
                      {t.tenant?.full_name || t.tenant?.email || "—"} · {getRoomDisplay(t.rooms)}
                    </p>
                    <p className="text-sm text-[#6b7280]">
                      {t.start_date}
                      {t.end_date ? ` → ${t.end_date}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleEndTenancy(t.id)}
                    disabled={loading}
                  >
                    End tenancy
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ended tenancies</CardTitle>
          <CardDescription>{ended.length} ended</CardDescription>
        </CardHeader>
        <CardContent>
          {!ended.length ? (
            <p className="text-[#6b7280]">No ended tenancies</p>
          ) : (
            <ul className="space-y-3">
              {ended.map((t) => (
                <li key={t.id} className="rounded-lg border border-[#e9e3f5] p-4 opacity-75">
                  <p className="font-medium">
                    {t.tenant?.full_name || t.tenant?.email || "—"} · {getRoomDisplay(t.rooms)}
                  </p>
                  <p className="text-sm text-[#6b7280]">
                    {t.start_date}
                    {t.end_date ? ` → ${t.end_date}` : ""} · {t.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
