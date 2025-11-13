import Link from "next/link";

export default function Sidebar() {
    const menuItems = [
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Teams", href: "/teams" },
        { label: "Tasks", href: "/tasks" },
        { label: "Reports", href: "/reports" },
    ];

    return (
        // <aside className="w-64 bg-white border-r border-gray-200 p-6 min-h-screen">
        <aside className="w-64 h-[calc(100vh-4rem)] bg-[#F7F8FA] border-r border-gray-200 fixed left-0 top-16 flex flex-col">
            <nav className="space-y-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block text-gray-700 hover:text-blue-600 hover:font-medium"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}