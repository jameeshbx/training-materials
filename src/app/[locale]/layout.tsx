import "@/styles/globals.css";
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import SocketListener from "@/components/SocketListener";

const locales = ['en', 'ml']; // Update here

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  // Await the params
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  try {
    const messages = await getMessages({ locale });
    
    return (
      <html lang={locale}>
        <body className="flex flex-col min-h-screen">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <SocketListener />
              <Navbar />
              <main className="pt-20 flex-grow">{children}</main>
              <Toaster position="top-right" />
              <Footer />
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error loading messages:', error);
    notFound();
  }
}

// Static params for SSG
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}