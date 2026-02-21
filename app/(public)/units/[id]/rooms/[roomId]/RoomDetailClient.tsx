"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

type Props = {
  roomId: string;
  unitId: string;
  alreadyOnWaitlist: boolean;
  currentPath: string;
};

export function RoomDetailClient({
  roomId,
  unitId,
  alreadyOnWaitlist,
  currentPath,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(alreadyOnWaitlist);

  async function handleJoin() {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId }),
      });
      const data = await res.json();
      if (res.ok) {
        setJoined(true);
      } else {
        const msg = data?.error === "Already on waitlist"
          ? "You are already on the waitlist."
          : data?.error || "Failed to join waitlist";
        alert(msg);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const signInUrl = `/auth?redirect=${encodeURIComponent(currentPath)}`;

  if (joined) {
    return (
      <div className="rounded-xl bg-[#a7f3ec]/30 px-6 py-4 text-[#1a9b8f]">
        <p className="font-medium">You&apos;re on the waitlist for this room.</p>
        <p className="mt-1 text-sm">
          We&apos;ll notify you when it becomes available.
        </p>
        <Link
          href={`/units/${unitId}`}
          className="mt-4 inline-block text-sm font-medium text-[#2ec4b6] hover:underline"
        >
          ← Back to unit
        </Link>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <button
          type="button"
          onClick={handleJoin}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#1a9b8f] disabled:opacity-50"
        >
          {loading ? "Joining…" : "Join waitlist"}
        </button>
        <Link
          href={`/units/${unitId}`}
          className="ml-4 inline-block text-sm text-[#6b7280] hover:text-[#2ec4b6]"
        >
          ← Back to unit
        </Link>
      </SignedIn>
      <SignedOut>
        <Link
          href={signInUrl}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#1a9b8f]"
        >
          Sign in to join waitlist
        </Link>
        <p className="mt-2 text-sm text-[#6b7280]">
          You need to sign in to join the waitlist.
        </p>
      </SignedOut>
    </>
  );
}
