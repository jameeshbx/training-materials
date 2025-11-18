"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if (status === "loading") return <p className="text-black">Loading...</p>;

  return (
    <h1 className="text-black text-2xl font-semibold">
      Dashboard - Welcome {session?.user?.name}
    </h1>
  );
}
