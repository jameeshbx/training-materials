

"use client";

import "../styles/globals.css";
import { useState } from "react";
import type { ReactNode } from "react";
import Provider from "./SessionProvider";
import { Toaster } from "sonner";
import LayoutWrapper from "../components/LayoutWrapper";

import { NextIntlClientProvider } from "next-intl";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

// ✅ Service Worker Register (correct)
import ServiceWorkerRegister from "./ServiceWorkerRegister";

export default function RootLayout({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<"en" | "es">("en");

    const messages = locale === "en" ? en : es;

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                {/* ✅ PWA META TAGS */}
                <meta name="application-name" content="Gokul’s World" />
                <meta name="theme-color" content="#020617" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Gokul’s World" />

                {/* ✅ PWA ICONS */}
                <link rel="icon" href="/icons/android-chrome-192x192.png" />
                <link
                    rel="apple-touch-icon"
                    href="/icons/android-chrome-192x192.png"
                />

                {/* ✅ PWA MANIFEST */}
                <link rel="manifest" href="/manifest.json" />
            </head>

            <body className="bg-white text-black" suppressHydrationWarning>
                {/* ✅ REGISTER SERVICE WORKER FIRST */}
                <ServiceWorkerRegister />

                <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
                    <Provider>
                        <LayoutWrapper setLocale={setLocale}>
                            {children}
                        </LayoutWrapper>
                    </Provider>
                </NextIntlClientProvider>

                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
