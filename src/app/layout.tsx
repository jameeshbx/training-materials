import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <html lang="en">
      <body>
        <Navbar />

        {/* Add spacing equal to Navbar height */}
        <main className="pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}


