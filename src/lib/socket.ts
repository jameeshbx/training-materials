// src/lib/socket.ts - മെച്ചപ്പെടുത്തൽ
import { io } from "socket.io-client";

// Development-ൽ മാത്രം logs കാണിക്കുക
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
  transports: ["websocket", "polling"], // fallback ആയി polling ചേർക്കുക
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection events
socket.on("connect", () => {
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 Socket Connected:", socket.id);
  }
});

socket.on("disconnect", (reason) => {
  if (process.env.NODE_ENV === "development") {
    console.log("🔴 Socket Disconnected:", reason);
  }
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket Connection Error:", error);
});

export default socket;