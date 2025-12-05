// src/app/invite/accept/AcceptInviteClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function AcceptInviteClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your invite...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invite link.");
      return;
    }

    async function acceptInvite() {
      try {
        const res = await fetch("/api/invites/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Account created! Logging you in...");

          try {
            const signInResult = await signIn("credentials", {
              email: data.email,
              password: data.password,
              redirect: false,
            });

            if (signInResult?.error) {
              // Check if it's a rate limit error
              if (signInResult.error === "Too many requests" || 
                  signInResult.error.includes("rate limit") || 
                  signInResult.error.includes("429")) {
                setStatus("error");
                setMessage("Too many login attempts. Please wait a minute before trying again.");
                return;
              }
              setStatus("error");
              setMessage("Failed to log in. Please try logging in manually.");
              return;
            }

            if (signInResult?.ok) {
              window.location.href = "/dashboard";
            }
          } catch (signInError: any) {
            console.error("Sign in error:", signInError);
            // Check if it's a rate limit error
            if (signInError?.message?.includes("429") || 
                signInError?.message?.includes("rate limit") || 
                signInError?.message?.includes("Too many requests") ||
                signInError?.message?.includes("Failed to construct 'URL'") ||
                signInError?.message?.includes("Invalid URL")) {
              setStatus("error");
              setMessage("Too many login attempts. Please wait a minute before trying again.");
            } else {
              setStatus("error");
              setMessage("Failed to log in. Please try logging in manually.");
            }
          }
        } else if (data.requiresSignup) {
          setStatus("success");
          setMessage("Invite verified! Redirecting to signup...");
          setTimeout(() => {
            window.location.href = `/signup?token=${token}`;
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "This invite is invalid or has already been used.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      }
    }

    acceptInvite();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-8 bg-gray-900 rounded-xl shadow-2xl max-w-md mx-4">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Team Invite
        </h1>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="text-lg">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-400">
            <p className="text-2xl font-semibold">{message}</p>
            <p className="mt-4 text-gray-300">Redirecting...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-400">
            <p className="text-xl font-medium">{message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
