import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <aside className="w-6 h-screen fixed top-0 left-33 bg-[#F2F4F7] border-r border-gray-300 z-50">
        <Sidebar />
      </aside>

      <div className="flex-1 ml-64">
        <header className="fixed top-0 left-37 right-0 h-7 bg-white shadow-md border-b border-gray-200 z-40 flex items-center px-6">
          <Header />
        </header>

<main className="pt-24 px-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
