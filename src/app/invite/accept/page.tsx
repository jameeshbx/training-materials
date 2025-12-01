// app/invite/accept/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!token) {
      setMessage("No invite token provided.");
      return;
    }

    if (status === "unauthenticated") {
      signIn(undefined, {
        callbackUrl: `/invite/accept?token=${encodeURIComponent(token)}`,
      });
    }
  }, [status, token]);

  async function accept() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      // Safe parsing — because server may return HTML instead of JSON
      const text = await res.text();
      let json: any;

      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error("Server returned invalid response (HTML instead of JSON).");
      }

      if (!res.ok) {
        throw new Error(json.error || json.message || "Failed to accept invite");
      }

      setMessage("Invite accepted — you have joined the team!");

      setTimeout(() => router.push("/"), 1500);

    } catch (err: any) {
      setMessage(err.message || "Error accepting invite");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return <div className="p-6">Invalid invite link.</div>;
  }

  if (status === "loading") {
    return <div className="p-6">Checking your session...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Accept Invite</h1>
      <p className="mb-4">Click the button to accept your invitation.</p>

      <button
        onClick={accept}
        className="bg-teal-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Accepting..." : "Accept Invite"}
      </button>

      {message && <div className="mt-4 text-sm">{message}</div>}
    </div>
  );
}
