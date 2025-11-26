// lib/socketServer.ts - IMPROVED
import { Server } from "socket.io";

// Global variable to store io instance
declare global {
  var io: Server | undefined;
}

export const initSocket = (server: any) => {
  if (!global.io) {
    global.io = new Server(server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    global.io.on("connection", (socket) => {
      console.log("🔥 Socket Connected:", socket.id);
      
      socket.on("disconnect", () => {
        console.log("🔌 Socket Disconnected:", socket.id);
      });
    });

    console.log("🚀 Socket Server Started");
  }
  return global.io;
};

export const getIO = () => {
  if (!global.io) {
    throw new Error("Socket.IO not initialized");
  }
  return global.io;
};