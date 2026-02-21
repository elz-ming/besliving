"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

type Props = {
  propertyId: string;
  alreadyOnWaitlist?: boolean;
};

export function JoinWaitlistButton({
  propertyId,
  alreadyOnWaitlist = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(alreadyOnWaitlist);

  async function handleJoin() {
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ property_id: propertyId }),
      });
      if (res.ok) setJoined(true);
      else {
        const { error } = await res.json();
        alert(error || "Failed to join");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (joined) {
    return (
      <div className="mt-8 rounded-xl bg-[#a7f3ec]/30 px-6 py-4 text-[#1a9b8f]">
        You&apos;re on the waitlist for this property.
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
          className="mt-8 inline-block rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-white hover:bg-[#1a9b8f] disabled:opacity-50"
        >
          {loading ? "Joining…" : "Join waitlist"}
        </button>
      </SignedIn>
      <SignedOut>
        <Link
          href="/auth"
          className="mt-8 inline-block rounded-xl bg-[#2ec4b6] px-8 py-3 font-semibold text-white hover:bg-[#1a9b8f]"
        >
          Sign in to join waitlist
        </Link>
      </SignedOut>
    </>
  );
}
