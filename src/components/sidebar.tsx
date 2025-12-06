"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const routes = [
  { href: "/home", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/teams", label: "Teams" },
  { href: "/task", label: "Tasks" },
  { href: "/reports", label: "Reports" },
  { href: "/files", label: "Documents" },

];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function goToFiles() {
    router.push("/files");
  }

  return (
    <aside
      className="
        w-64 
        bg-gray-800 
        text-white 
        flex 
        flex-col 
        p-4 
        space-y-2 
        min-h-screen
        
      "
    >
      {/* Navigation Routes */}
      {routes.map((route) => {
        const active = pathname === route.href;

        return (
          <Link
            key={route.href}
            href={route.href}
            className={`block px-4 py-2 rounded-md transition
              ${active ? "bg-blue-600" : "hover:bg-gray-700 hover:text-blue-300"}
            `}
          >
            {route.label}
          </Link>
        );
      })}

    

    </aside>
  );
}
