"use client";

import { useState } from "react";

export function InviteForm({ teamId }: { teamId: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("📨 Sending request to /api/invites"); // Debug

    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, teamId }),
      });

      const data = await res.json();
      console.log("📩 Response from /api/invites:", data); // Debug

      if (!res.ok) {
        setMessage(data.error || "Failed to send invite");
      } else {
        setMessage("Invite email sent successfully!");
        setEmail("");
      }
    } catch (err) {
      console.error("❌ Error in form submit:", err);
      setMessage("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded p-4 max-w-md space-y-2">
      <h2 className="font-semibold text-lg">Invite Member</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          className="border rounded px-3 py-2 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </form>

      {message && <p className="text-sm mt-1">{message}</p>}
    </div>
  );
}
