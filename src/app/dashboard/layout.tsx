"use client";
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

  return (
    <div className="flex min-h-screen mt-2">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 bg-gray-100">
        {/* Top Header */}
        <div className="h-16  bg-gray-200  flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            {pathname === "/dashboard" ? "Dashboard" : ""}
          </h1>
          <Button className="bg-green-300">Logout</Button>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
