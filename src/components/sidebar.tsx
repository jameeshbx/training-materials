"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Route = {
  href: string;
  label: string;
};

const routes: Route[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/teams", label: "Teams" },
  { href: "/tasks", label: "Tasks" },
  { href: "/reports", label: "Reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-2 min-h-screen">
      {routes.map((route) => {
        const isActive = pathname === route.href;
        return (
          <Link
            key={route.href}
            href={route.href}
            className={`block px-4 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-gray-700 hover:text-blue-300"
            }`}
          >
            {route.label}
          </Link>
        );
      })}
    </aside>
  );
}
