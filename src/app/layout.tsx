"use client";

import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import AuthSessionProvider from "@/components/SessionProviderWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-100">
        <AuthSessionProvider>

          {/* Pass toggle button */}
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <div className="flex flex-1">

            {/* SIDEBAR */}
            <div
              className={`
                bg-gray-800 text-white transition-all duration-300
                ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}
                min-h-screen
              `}
            >
              {sidebarOpen && <Sidebar />}
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 sm:p-6 bg-white overflow-y-auto">
              {children}
            </main>

          </div>

        </AuthSessionProvider>
      </body>
    </html>
  );
}
