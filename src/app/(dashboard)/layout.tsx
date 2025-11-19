import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-screen bg-[#F2F4F7] border-r border-gray-300 z-50">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40 flex items-center px-6">
          <Header />
        </header>

        {/* Page Content */}
        <main className="pt-20 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
