"use client";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  // 🔥 Logout function
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "GET" });
    window.location.href = "/login"; // redirect after logout
  };

  return (
    <div className="flex min-h-screen mt-2">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 bg-gray-100">
        {/* Top Header */}
        <div className="h-16 bg-gray-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {pathname === "/dashboard" ? "Dashboard" : ""}
          </h1>

          {/* Logout Button */}
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Logout
          </Button>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
