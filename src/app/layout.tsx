"use client";

import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";
import { useState, useEffect } from "react";
import AuthSessionProvider from "@/components/SessionProviderWrapper";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import PWAHead from "@/components/PWAHead";
import RegisterSW from "@/components/RegisterSW";
import InjectManifest from "@/components/InjectManifest";

// ✅ Import messages
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // ✅ Default locale (you can improve this later)
  const locale = pathname.startsWith("/es") ? "es" : "en";
  const messages = locale === "es" ? esMessages : enMessages;

  // Pages where we should NOT show header and sidebar
  const hideLayout = ["/login", "/signup"].includes(pathname);

  // Auto-close sidebar on small screens
  useEffect(() => {
    fetch("/api/socket");

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang={locale}>
      <body className="bg-gray-100 text-gray-900">
        <PWAHead />
        <RegisterSW />
    <InjectManifest />

        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          // ✅ Fix for ENVIRONMENT_FALLBACK error
          timeZone="Asia/Kolkata"
        >
          <AuthSessionProvider>

            {/* HIDE NAVBAR & SIDEBAR WHEN hideLayout = true */}
            {!hideLayout && (
              <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            )}

            <div className="flex w-full">

              {/* SIDEBAR (only show if NOT login/signup) */}
              {!hideLayout && (
                <>
                  <div
                    className={`
                      fixed lg:static top-0 left-0 z-40
                      bg-gray-900 text-white h-full
                      transition-all duration-300
                      ${sidebarOpen ? "w-64" : "w-0 lg:w-64"}
                      overflow-hidden
                    `}
                  >
                    {sidebarOpen && <Sidebar />}
                  </div>

                  {/* BACKDROP FOR MOBILE */}
                  {sidebarOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
                      onClick={() => setSidebarOpen(false)}
                    />
                  )}
                </>
              )}

              {/* MAIN CONTENT */}
              <main
                className={`flex-1 p-6 bg-white text-black overflow-y-auto 
                ${hideLayout ? "ml-0" : "md:ml-0"}`}
                id="main"  // ✅ accessibility
              >
                {children}
                <Toaster position="top-right" />
              </main>

            </div>
          </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
