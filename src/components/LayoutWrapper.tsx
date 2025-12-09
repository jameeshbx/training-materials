
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";

export default function LayoutWrapper({
    children,
    setLocale,
}: {
    children: React.ReactNode;
    setLocale: (lang: "en" | "es") => void;
}) {
    const pathname = usePathname();

    // Hide layout on these routes
    const hideLayout =
        pathname === "/" ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/signup";

    if (hideLayout) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <div className="w-full min-h-screen flex">
            {/* ✅ Sidebar */}
            <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 bg-[#F2F4F7] border-r border-gray-300 z-50">
                <Sidebar />
            </aside>

            {/* ✅ Page wrapper */}
            <div className="flex-1 w-full lg:ml-64 relative">
                {/* ✅ FULL-WIDTH FIXED HEADER */}
                <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40">
                    <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:pl-[17rem]">
                        <MobileNav />
                        <Header setLocale={setLocale} />
                    </div>
                </div>

                {/* ✅ Page content */}
                <main className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
