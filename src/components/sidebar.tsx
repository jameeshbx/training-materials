"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiHome, FiGrid, FiUsers, FiCheckSquare, FiFileText, FiFolder } from "react-icons/fi";

const routes = [
  { href: "/home", label: "Home", icon: <FiHome size={18} /> },
  { href: "/dashboard", label: "Dashboard", icon: <FiGrid size={18} /> },
  { href: "/teams", label: "Teams", icon: <FiUsers size={18} /> },
  { href: "/task", label: "Tasks", icon: <FiCheckSquare size={18} /> },
  { href: "/reports", label: "Reports", icon: <FiFileText size={18} /> },
  { href: "/files", label: "Documents", icon: <FiFolder size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className="
        w-64 min-h-screen
        bg-gradient-to-b from-gray-900 to-gray-800
        text-gray-200
        flex flex-col 
        py-6 px-4
        shadow-xl
        border-r border-gray-700
        fixed
      "
    >
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold tracking-wide text-white">
          My Next App
        </h1>
      </div>

      <nav className="flex flex-col space-y-1">
        {routes.map((route) => {
          const active = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition duration-200
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              {route.icon}
              {route.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
