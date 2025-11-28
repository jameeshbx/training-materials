"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(
  userId: string,
  userName: string,
  onEvent: (type: string, data: any) => void
) {
  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("user:join", { userId, userName });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.onAny((event, ...args) => {
      onEvent(event, args[0]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.offAny();
      socket.disconnect();
    };
  }, [userId, userName, onEvent]);
}