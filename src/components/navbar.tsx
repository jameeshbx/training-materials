"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white shadow-md py-3">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        
        {/* Left side - logo */}
        <h1 className="text-2xl font-semibold tracking-wide">My Next App</h1>

        {/* Right side - Signup Button */}
        <Link 
          href="/signup"
          className="
            bg-black-600 
            text-white 
            px-4 
            py-2 
            rounded-lg 
            hover:bg-blue-700 
            transition-all 
            duration-200 
            shadow-md
          "
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
