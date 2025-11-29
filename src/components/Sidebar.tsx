"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Bell, 
  ClipboardList, 
  BarChart3, 
  Upload,
  Menu, 
  X,
  Users,
  Shield
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, sidebar should be open by default
      if (!mobile) {
        setIsOpen(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/dashboard/tasks", icon: ClipboardList, label: "Tasks" },
    { href: "/dashboard/reports", icon: BarChart3, label: "Reports" },
    { href: "/dashboard/uploads", icon: Upload, label: "Uploads" }
  ];

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header with Hamburger Button */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-sky-500 to-sky-600 shadow-lg z-50 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
            </button>
          
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky
          top-0 left-0
          h-screen 
          bg-gradient-to-b from-sky-400 to-sky-500
          shadow-2xl
          z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isMobile ? "w-72" : "w-64"}
        `}
      >
        {/* Desktop Header */}
        {!isMobile && (
          <div className="p-6 border-b border-sky-400/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Dashboard</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-white/10 transition-colors md:hidden"
              aria-label="Close menu"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-4 p-4 rounded-xl
                  transition-all duration-200
                  font-medium
                  group
                  ${isActive 
                    ? "bg-white/20 text-white shadow-lg transform scale-105 border-l-4 border-white" 
                    : "text-white/90 hover:bg-white/10 hover:text-white hover:border-l-4 border-white/30"
                  }
                `}
              >
                <Icon 
                  size={22} 
                  className={`
                    transition-transform duration-200
                    ${isActive 
                      ? "text-white scale-110" 
                      : "text-white/80 group-hover:scale-105"
                    }
                  `} 
                />
                <span className="text-lg font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info Section */}
        <div className="absolute bottom-6 left-4 right-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <Users size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Welcome Back!</p>
              <p className="text-white/70 text-xs">Manage your workspace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content spacer for mobile header */}
      {isMobile && <div className="h-16 md:h-0"></div>}
    </>
  );
}