"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";


interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");   // 👈 namespace

  const menu = [
    { label: t("home"), href: "/" },
    { label: t("dashboard"), href: "/dashboard" },
    { label: t("teams"), href: "/teams" },
    { label: t("tasks"), href: "/tasks" },
    { label: t("reports"), href: "/reports" },
    { label: t("documents"), href: "/documents" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
      id="sidebar"   // 🟣 ADD THIS
        aria-label="Main navigation"  // optional accessibility improvement  
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#F7F8FA] border-r border-gray-200 z-50
          flex flex-col justify-between
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >

        <div className="flex-1 overflow-y-auto">
          {/* Title */}
          <div className="px-6 py-6 border-b">
            <h1 className="text-xl font-bold text-blue-600">
              {t("title")}
            </h1>
          </div>

          {/* Menu */}
          <nav className="px-2 py-4 space-y-1">
            {menu.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

                  

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  aria-current={active ? "page" : undefined} 
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all 
                    ${
                      active
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <LanguageSwitcher />


        {/* Footer */}
        <div className="p-4 text-[10px] text-gray-500 border-t">
          © 2024 {t("title")}
          
        </div>
      </aside>
    </>
  );
}
