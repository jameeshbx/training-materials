import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import AuthSessionProvider from "@/components/SessionProviderWrapper";

export const metadata = {
  title: "My Next App",
  description: "Dashboard with sidebar & header",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">

        {/* 🔥 Wrap entire app in SessionProvider */}
        <AuthSessionProvider>
          {/* Header */}
          <Navbar />

          {/* Body layout */}
          <div className="flex flex-1">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto bg-white">
              {children}
            </main>
          </div>
        </AuthSessionProvider>

      </body>
    </html>
  );
}
