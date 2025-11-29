"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="pt-20 flex-grow">
            {children}
          </main>
          <Toaster position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}