"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const processInvite = async () => {
      try {
        const res = await fetch("/api/invite/accept", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message);
          return router.push("/login");
        }

        // 🔥 Auto Login with credentials
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error("Sign in error:", signInResult.error);
          alert("Login failed. Please try logging in manually.");
          return router.push("/login");
        }

        // Success - redirect directly to dashboard
        window.location.href = "/dashboard";
        
      } catch (error) {
        console.error("Invite processing error:", error);
        alert("Something went wrong. Please try again.");
        router.push("/login");
      }
    };

    processInvite();
  }, [token, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center p-10 text-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        Processing your invitation... ⏳
      </div>
    </div>
  );
}