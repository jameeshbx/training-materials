"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Processing invite...");

  useEffect(() => {
    async function acceptInvite() {
      try {
        const res = await fetch("/api/invites/accept", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          setStatus("Invite Accepted! Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/dashboard"; // redirect to login
          }, 1500);
        } else {
          setStatus("Invalid or expired invite.");
        }
      } catch (error) {
        console.error(error);
        setStatus("Server error. Try again later.");
      }
    }

    if (token) {
      acceptInvite();
    } else {
      setStatus("Invalid invite link.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Accepting Invite</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}