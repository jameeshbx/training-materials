"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Use the same port as Next.js server (since they're integrated)
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    
    const s = io(socketUrl, {
      transports: ["websocket", "polling"], // Allow fallback to polling
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    s.on("connect", () => {
      console.log("🟢 Connected to socket server");
    });

    s.on("disconnect", () => {
      console.log("🔴 Disconnected from socket server");
    });

    s.on("connect_error", (error) => {
      console.warn("⚠️ Socket connection error (this is OK if server.js is not running):", error.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
