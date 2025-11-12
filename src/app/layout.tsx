import "@/styles/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-gray-800">
        <Navbar />
        <main className="flex flex-col items-center justify-center min-h-[80vh] max-w-5xl mx-auto px-6 text-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
