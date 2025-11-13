import "../styles/globals.css";
import type { ReactNode } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#060E25] text-white">

        {/* FIXED SIDEBAR */}
        <div className="flex">

          <aside className="w-64 h-screen fixed top-0 left-0 bg-[#F2F4F7] border-r border-gray-300 z-50">
            <Sidebar />
          </aside>

          {/* MAIN WRAPPER */}
          <div className="flex-1 ml-64">

            {/* FIXED HEADER */}
            <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40 flex items-center px-6">
              <Header />
            </header>

            {/* PAGE CONTENT */}
            <main className="pt-20 px-6">
              {children}
            </main>

          </div>
        </div>

      </body>
    </html>
  );
}