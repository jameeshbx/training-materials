"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import socket from "@/lib/socket";
import Tasks from "./tasks/page";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ⛔ Wait until session loads
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  // 🔥 Socket listener
  useEffect(() => {
  if (!socket.connected) socket.connect();

  socket.on("user_logged_in", (data) => {
    toast(`👋 ${data.name} just logged in`);
  });

  return () => {
    socket.off("user_logged_in");
  };
}, []);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div>
      <Tasks />
    </div>
  );
}
