
import Link from "next/link";
import {
    FiHome,
    FiGrid,
    FiUsers,
    FiCheckSquare,
    FiBarChart2,
    FiFolder,
} from "react-icons/fi";

export default function Sidebar() {
    const menuItems = [
        { label: "Home", href: "/", icon: <FiHome size={18} /> },
        { label: "Dashboard", href: "/dashboard", icon: <FiGrid size={18} /> },
        { label: "Teams", href: "/teams", icon: <FiUsers size={18} /> },
        { label: "Tasks", href: "/tasks", icon: <FiCheckSquare size={18} /> },
        { label: "Reports", href: "/reports", icon: <FiBarChart2 size={18} /> },
        { label: "Files", href: "/files", icon: <FiFolder size={18} /> },
    ];

    return (
        <aside
            className="w-64 h-[calc(100vh-4rem)] 
      bg-white  border-gray-200 
      fixed left-0 top-16 
      flex flex-col justify-between"
        >
            {/* ✅ NAVIGATION ONLY (NO WORK PANEL SECTION NOW) */}
            <nav className="mt-6 px-3 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="
              flex items-center gap-3
              px-4 py-2.5 rounded-lg
              text-gray-700 text-sm
              hover:bg-blue-50 hover:text-blue-600 
              hover:translate-x-1
              transition-all duration-200
            "
                    >
                        <span className="text-gray-500">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

        </aside>
    );
}
