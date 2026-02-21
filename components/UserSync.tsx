"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export function UserSync() {
  const { isSignedIn, user } = useUser();
  const { loaded } = useClerk();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!loaded || !isSignedIn || !user || syncedRef.current) return;
    syncedRef.current = true;

    fetch("/api/users/sync", { method: "POST" })
      .then((res) => {
        if (!res.ok) syncedRef.current = false;
      })
      .catch(() => {
        syncedRef.current = false;
      });
  }, [loaded, isSignedIn, user]);

  return null;
}
