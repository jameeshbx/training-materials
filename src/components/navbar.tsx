"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  return (
    <nav className="w-full bg-gray-800 text-white shadow-md py-3">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* App Name */}
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            My Next App
          </h1>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* SIGN UP */}
          <Link
            href="/signup"
            className="
              bg-white
              text-black
              px-4 
              py-2 
              rounded-lg 
              hover:bg-blue-700 
              hover:text-white
              transition-all 
              duration-200 
              shadow-md
              text-sm md:text-base
            "
          >
            Sign Up
          </Link>

          {/* SIGN OUT */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
              bg-red-600
              text-white 
              px-4 
              py-2 
              rounded-lg 
              hover:bg-red-700 
              transition-all 
              duration-200 
              shadow-md
              text-sm md:text-base
            "
          >
            Sign Out
          </button>

        </div>

      </div>
    </nav>
  );
}
