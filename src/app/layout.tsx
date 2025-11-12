import "@/styles/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="max-w-5xl mx-auto p-6">
          <Navbar />
          {children}</main>
      </body>
    </html>
  );
}
