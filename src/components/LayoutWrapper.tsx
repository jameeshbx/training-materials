

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
            <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 bg-white z-30">
                <Sidebar />
            </aside>

            {/* ✅ Page wrapper */}
            <div className="flex-1 w-full lg:ml-64 relative">

                {/* FULL-WIDTH FIXED HEADER */}
                <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-none z-50 flex">

                    {/* White block to align with sidebar */}
                    <div className="hidden lg:block w-0 h-16 bg-white"></div>

                    {/* <-- changed justify-between to justify-start here */}
                    <div className="h-full flex items-center justify-start flex-1  ">
                       
                        <Header setLocale={setLocale} />
                    </div>
                </div>

                {/* Page content */}
                <main className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
