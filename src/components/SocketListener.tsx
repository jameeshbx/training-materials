"use client";

import { useEffect } from "react";
import { useSocket } from "@/components/SocketProvider";

export default function SocketListener() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    console.log("👂 Listening for realtime events...");

    socket.on("taskCreated", (data) => {
      console.log("📥 New task event received:", data);

      alert(`🆕 New task created: ${data.task.title}`);
      // Later we will replace alert with Toast UI
    });

    return () => {
      socket.off("taskCreated");
    };
  }, [socket]);

  return null; // component invisible
}
