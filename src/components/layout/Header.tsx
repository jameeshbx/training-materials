"use client";
import LogoutButton from "@/components/LogoutButton";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen?: boolean;  // optional if you want aria-expanded
}

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      
      {/* Mobile toggle button */}
      <button
        className="lg:hidden text-2xl text-gray-700"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar navigation"
        aria-expanded={isSidebarOpen ? "true" : "false"}
        aria-controls="sidebar"
      >
        ☰
      </button>

      <h1 className="text-lg font-semibold text-gray-800">
        header
      </h1>

      <div>
        <LogoutButton aria-label="Logout from your account" />
      </div>
    </div>
  );
}
