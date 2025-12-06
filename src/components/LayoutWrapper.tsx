// "use client";

// import { usePathname } from "next/navigation";
// import Sidebar from "./Sidebar";
// import Navbar from "@/components/Navbar";
// // import MobileNav from "./MobileNav";

// export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
//     const pathname = usePathname();

//     // Hide layout on these routes
//     const hideLayout =
//         pathname === "/" ||
//         pathname === "/login" ||
//         pathname === "/register" ||
//         pathname === "/signup";

//     if (hideLayout) {
//         return <main className="min-h-screen">{children}</main>;
//     }

//     return (
//         <div className="flex flex-col lg:flex-row">
//             {/* Sidebar */}
//             <aside className="hidden lg:block w-full lg:w-64 lg:h-screen lg:fixed lg:top-0 lg:left-0 bg-[#F2F4F7] border-r border-gray-300 z-50">
//                 <Sidebar />
//             </aside>

//             {/* Main content */}
//             <div className="flex-1 w-full lg:ml-64">
//                 {/* Header */}
//                 <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-md border-b border-gray-200 z-40 flex items-center justify-between px-4 sm:px-6">
//                     {/* <MobileNav /> */}
//                     <Navbar />
//                 </header>

//                 <main className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">{children}</main>
//             </div>
//         </div>
//     );
// }