"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      // Emit logout activity BEFORE signing out via API route
      // Use fetch instead of direct emitActivity call (client component can't use server-side db)
      await fetch("/api/emit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "activity",
          activity: {
            type: "logout",
            // @ts-ignore
            userId: session?.user?.id || "unknown",
            userName: session?.user?.name || "Unknown User",
            // @ts-ignore
            teamId: session?.user?.teamId || null,
            timestamp: new Date().toISOString(),
          },
          // @ts-ignore
          teamId: session?.user?.teamId || null,
        }),
      });
    } catch (error) {
      // Silently fail - don't block logout if activity emission fails
      console.error("Failed to emit logout activity:", error);
    }

    // Always proceed with logout, even if activity emission failed
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <button
     aria-label="Logout"
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
