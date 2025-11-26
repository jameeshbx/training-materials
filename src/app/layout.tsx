"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import "@/styles/globals.css";
import Providers from "@/components/Providers"; // <-- use this
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
export default function RootLayout({ children }: { children: ReactNode }) {
  //   useEffect(() => {
  //   if (socket) socket.connect();

  //   return () => {
  //     if (socket) socket.disconnect();
  //   };
  // }, []);
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="pt-20">{children}</main>
           <Toaster position="top-right" />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
