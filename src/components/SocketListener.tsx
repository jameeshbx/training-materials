"use client";

import {useEffect} from "react";
import socket from "@/lib/socket";
import toast from "react-hot-toast";

export default function SocketListener() {
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const saveNotification = async (message: string) => {
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({message})
        });
      } catch (err) {
        console.error("❌ Failed to save notification", err);
      }
    };

    const onLogin = (data: {id: number; name: string; email: string}) => {
      const msg = `👋 ${data.name} logged in`;
      toast.success(msg);
      saveNotification(msg);
    };

    socket.on("userLoggedIn", onLogin);

    return () => {
      socket.off("userLoggedIn", onLogin);
    };
  }, []);

  return null;
}
