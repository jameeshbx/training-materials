"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setMessage("No invite token provided.");
      return;
    }

    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: `/invite/accept?token=${encodeURIComponent(token)} `});
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

      const text = await res.text();
      const json = JSON.parse(text);

      if (!res.ok) throw new Error(json.error);

      setMessage("Invite accepted — you have joined the team!");

      setTimeout(() => router.push("/"), 1500);

    } catch (err: any) {
      setMessage(err.message);
    }

    setLoading(false);
  }

  if (!token) return <div>Invalid invite link.</div>;
  if (status === "loading") return <div>Checking your session...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Accept Invite</h1>
      <button onClick={accept} className="bg-teal-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Accepting..." : "Accept Invite"}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}