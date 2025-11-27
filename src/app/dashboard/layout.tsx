"use client";

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Home } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Function to get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/dashboard/tasks":
        return "All Tasks";
      case "/dashboard/reports":
        return "All Reports";
      case "/dashboard/uploads":
        return "All Files";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 mt-0.5">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Page Title with Icon */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* User Profile (optional) */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
              </div>

              {/* Enhanced Logout Button */}
              <Button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="outline"
                className="group relative bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-red-300 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Sign Out</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}