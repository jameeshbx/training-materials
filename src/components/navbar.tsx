"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const socketRef = useRef<any>(null);

  // Connect socket once
  useEffect(() => {
    socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });
    return () => socketRef.current?.disconnect();
  }, []);

  const handleLogout = async () => {
    if (socketRef.current) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (storedUser?.id) {
        socketRef.current.emit("logout", {
          id: storedUser.id,
          name: storedUser.name,
        });
      }
    }

    // Clear local user
    localStorage.removeItem("user");

    // NextAuth logout
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="w-full bg-gray-800 text-white shadow-md py-3">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
        
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            My Next App
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <Link
            href="/signup"
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all duration-200 shadow-md text-sm md:text-base"
          >
            Sign Up
          </Link>

          {/* FIXED REAL SIGN OUT */}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md text-sm md:text-base"
          >
            Sign Out
          </button>

        </div>
      </div>
    </nav>
  );
}
