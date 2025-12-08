"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SocketProvider } from "@/components/SocketProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SocketProvider>

      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white p-2 rounded z-[9999]"
      >
        Skip to main content
      </a>

      <div className="flex">

        <aside role="navigation" aria-label="Main navigation">
          <Sidebar
            isOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
          />
        </aside>

        <div className="flex-1 lg:ml-64">
          <header
            role="banner"
            className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40 flex items-center px-6"
          >
            <Header toggleSidebar={() => setSidebarOpen(true)} />
          </header>

          <main
            id="main-content"
            role="main"
            tabIndex={-1}
            className="pt-24 px-6"
          >
            {children}
          </main>
        </div>

      </div>
    </SocketProvider>
  );
}
