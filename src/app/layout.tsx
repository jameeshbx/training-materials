

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

export default function RootLayout({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<"en" | "es">("en");

    const messages = locale === "en" ? en : es;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className="bg-white text-black" suppressHydrationWarning>
                {/* <NextIntlClientProvider locale={locale} messages={messages}> */}
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


