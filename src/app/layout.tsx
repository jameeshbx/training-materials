"use client";

import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import AuthSessionProvider from "@/components/SessionProviderWrapper";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-close sidebar on small screens
  useEffect(() => {
      fetch("/api/socket"); 
      
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleResize(); // run on load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <AuthSessionProvider>

          {/* NAVBAR */}
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1 pt-2">

            {/* SIDEBAR (responsive) */}
            <div
              className={`
                bg-gray-800 text-white transition-all duration-300 
                fixed md:static top-0 left-0 h-full z-40
                ${sidebarOpen ? "w-64" : "w-0 md:w-0 overflow-hidden"}
                md:block
              `}
            >
              {sidebarOpen && <Sidebar />}
            </div>

            {/* BACKDROP for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 sm:p-6 bg-white text-black overflow-y-auto md:ml-0">
              {children}
                 <Toaster position="top-right" />
            </main>

          </div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
