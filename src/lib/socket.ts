// lib/socket.ts - IMPROVED
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: "/api/socket/io",
      autoConnect: true,
      transports: ["websocket", "polling"], // both try cheyyunnu
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      console.error("🔥 Connection error:", error);
    });
  }
  return socket;
};