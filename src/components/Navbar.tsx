"use client";
import { FiLogOut } from "react-icons/fi";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
<nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-white text-white shadow-lg py-10 px-6 text-xl">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left side - menu button and logo/title */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-blue-500 transition-colors md:hidden"
            aria-label="Toggle sidebar"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16m-7 6h7" 
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold tracking-wide">My Next App</h1>
        </div>

        {/* Right side - links */}
        <ul className="hidden md:flex space-x-8 text-lg">
          <li>
           <a
  href="/login"
  className="flex items-center text-black gap-2 hover:text-red-300 transition-colors"
>
  <FiLogOut className="text-lg" />
  
</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
