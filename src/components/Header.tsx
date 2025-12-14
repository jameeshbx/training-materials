

"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import MobileNav from "./MobileNav";

export default function Header({ setLocale }: any) {
    const { data: session } = useSession();

    return (
        <header
            className="
                w-full h-16
                bg-white
                shadow-sm border-b border-gray-200
                flex items-center
                px-3 sm:px-6
            "
        >
            {/* LEFT */}
            <div className="flex items-center gap-2">
                {/* ☰ Mobile toggle */}
                <div className="lg:hidden">
                    <MobileNav />
                </div>

                <Image
                    src="/task logo.png"
                    alt="logo"
                    width={28}
                    height={28}
                />

                <h1 className="text-sm sm:text-lg font-semibold text-blue-800">
                    Task Manager
                </h1>
            </div>

            {/* RIGHT */}
            <div className="ml-auto flex items-center gap-2">
                {/* Hide language on mobile */}
                <div className="hidden sm:flex gap-1">
                    <button
                        onClick={() => setLocale("en")}
                        className="px-2 py-1 text-xs rounded-full bg-gray-400"
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLocale("es")}
                        className="px-2 py-1 text-xs rounded-full bg-gray-400"
                    >
                        ES
                    </button>
                </div>

                {session?.user && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}
