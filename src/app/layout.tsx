import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

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
        {/* Header */}
        <Navbar />

        {/* Body: Sidebar + Main content */}
        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6 overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
