"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex items-start justify-center h-full pt-10">
        <p className="text-white">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center h-full pt-10">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
    </div>
  );
}
