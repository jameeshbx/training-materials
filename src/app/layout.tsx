
import "../styles/globals.css"
import type { ReactNode } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import MobileNav from "../components/MobileNav"

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-white text-white">
                {/* WRAPPER - Responsive flexbox layout */}
                <div className="flex flex-col lg:flex-row">
                    {/* SIDEBAR - Hidden on mobile/tablet, visible on lg and up */}
                    <aside className="hidden lg:block w-full lg:w-64 lg:h-screen lg:fixed lg:top-0 lg:left-0 bg-[#F2F4F7] border-r border-gray-300 z-50">
                        <Sidebar />
                    </aside>

                    {/* RIGHT SIDE (HEADER + CONTENT) */}
                    <div className="flex-1 w-full lg:ml-64">
                        {/* FIXED HEADER - Responsive positioning */}
                        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40 flex items-center justify-between px-4 sm:px-6">
                            <MobileNav />
                            <div className="flex-1 lg:flex">
                                <Header />
                            </div>
                        </header>

                        {/* MAIN CONTENT SECTION - Responsive padding */}
                        <main className="pt-20 min-h-screen lg:h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}









