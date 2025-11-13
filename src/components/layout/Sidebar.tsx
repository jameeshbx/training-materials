"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Teams", href: "/teams" },
    { label: "Tasks", href: "/tasks" },
    { label: "Reports", href: "/reports" },
  ];

  return (
     <aside className="w-64 h-screen bg-[#F7F8FA] border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      
      {/* Title */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">Training App</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menu.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all 
                ${active
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-200"}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 text-[10px] text-gray-500 border-t">
        © 2024 Training App
      </div>

    </aside>
  );
}
