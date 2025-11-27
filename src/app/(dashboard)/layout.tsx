"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SocketProvider } from "@/components/SocketProvider";  // correct import

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SocketProvider>
      <div className="flex">

        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:ml-64">
          <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40 flex items-center px-6">
            <Header toggleSidebar={() => setSidebarOpen(true)} />
          </header>

          <main className="pt-24 px-6">{children}</main>
        </div>
      </div>
    </SocketProvider>
  );
}
