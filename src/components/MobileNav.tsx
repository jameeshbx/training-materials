"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import { Menu, X } from "lucide-react"

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-900"
                aria-label="Toggle sidebar"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
                <>
                    
                    <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setIsOpen(false)} />
                    
                    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#F7F8FA] border-r border-gray-200 z-50 shadow-lg lg:hidden">
                        <Sidebar />
                    </aside>
                </>
            )}
        </>
    )
}
