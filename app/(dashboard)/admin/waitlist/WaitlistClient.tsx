"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Entry = {
  id: string;
  user_id: string;
  room_id: string | null;
  status: string;
  created_at: string;
  rooms: unknown;
  users: { full_name: string | null; email: string | null } | null;
};

function getEntryRoomDisplay(rooms: unknown): string {
  if (!rooms || typeof rooms !== "object") return "—";
  const r = rooms as { name?: string; units?: { title?: string } | { title?: string }[] };
  const units = Array.isArray(r.units) ? r.units[0] : r.units;
  return `${units?.title ?? "—"} / ${r.name ?? "—"}`;
}

type Unit = {
  id: string;
  title: string;
};

type Room = {
  id: string;
  name: string;
  unit_id: string;
  units?: { id?: string; title?: string } | { id?: string; title?: string }[] | null;
};

const STATUSES = ["pending", "offered", "accepted", "declined", "expired"] as const;

export function WaitlistClient({
  entries,
  units,
  rooms,
  filterUnitId,
  filterRoomId,
}: {
  entries: Entry[];
  units: Unit[];
  rooms: Room[];
  filterUnitId: string | null;
  filterRoomId: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleStatusChange(entryId: string, status: string) {
    setLoading(entryId);
    try {
      const res = await fetch(`/api/admin/waitlist/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        alert(error || "Failed");
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  const roomsForUnit = filterUnitId
    ? rooms.filter((r) => r.unit_id === filterUnitId)
    : rooms;

  function buildUrl(unitId: string | null, roomId: string | null) {
    const p = new URLSearchParams();
    if (unitId) p.set("unit_id", unitId);
    if (roomId) p.set("room_id", roomId);
    const q = p.toString();
    return `/admin/waitlist${q ? `?${q}` : ""}`;
  }

  function handleUnitChange(unitId: string) {
    router.push(buildUrl(unitId || null, null));
  }

  function handleRoomChange(roomId: string) {
    router.push(buildUrl(filterUnitId, roomId || null));
  }

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter by room</CardTitle>
          <CardDescription>Show waitlist entries for a specific unit or room</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Unit</label>
              <select
                value={filterUnitId ?? ""}
                onChange={(e) => handleUnitChange(e.target.value)}
                className="h-9 min-w-[200px] rounded-md border border-input bg-white px-3 py-1.5 text-sm"
              >
                <option value="">All units</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#374151]">Room</label>
              <select
                value={filterRoomId ?? ""}
                onChange={(e) => handleRoomChange(e.target.value)}
                className="h-9 min-w-[200px] rounded-md border border-input bg-white px-3 py-1.5 text-sm"
              >
                <option value="">All rooms</option>
                {roomsForUnit.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entries</CardTitle>
          <CardDescription>{entries.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          {!entries.length ? (
            <p className="text-[#6b7280]">No waitlist entries</p>
          ) : (
            <ul className="space-y-3">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#e9e3f5] p-4"
                >
                  <div>
                    <p className="font-medium">
                      {e.users?.full_name || e.users?.email || "—"}
                    </p>
                    <p className="text-sm text-[#6b7280]">
                      {getEntryRoomDisplay(e.rooms)} · {new Date(e.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={e.status}
                      onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                      disabled={loading === e.id}
                      className="h-8 rounded-md border border-input px-2 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
