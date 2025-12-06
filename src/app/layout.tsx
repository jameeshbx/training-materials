"use client"

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import socket from "@/lib/socket";
import toast from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const saveNotification = async (message: string) => {
      try {
        await fetch("/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
      } catch (err) {
        console.error("❌ Failed to save notification", err);
      }
    };

    // Real-time event handler
    const onLogin = (data: { id: number; name: string; email: string }) => {
      const msg = `👋 ${data.name} logged in`;
      
      toast.success(msg);
      
      // optional DB save
      saveNotification(msg);

      console.log("Real-time login:", data);
    };

    socket.on("userLoggedIn", onLogin);

    return () => {
      socket.off("userLoggedIn", onLogin);
    };
  }, []);

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
