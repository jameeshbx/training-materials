

"use client";

import { signOut, useSession } from "next-auth/react";

export default function Header({
    setLocale,
}: {
    setLocale: (lang: "en" | "es") => void;
}) {
    const { data: session } = useSession();

    return (
        <div className="w-full h-16 flex items-center justify-between bg-white px-4 sm:px-6">
            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-800">Header</h1>

            {/* Right Side: Language + Logout */}
            <div className="flex items-center gap-3">
                {/* ✅ Language Switch Buttons */}
                <button
                    onClick={() => setLocale("en")}
                    className="px-3 py-1.5 text-xs rounded-full 
          bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                    EN
                </button>

                <button
                    onClick={() => setLocale("es")}
                    className="px-3 py-1.5 text-xs rounded-full 
          bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                    ES
                </button>

                {/* ✅ Logout */}
                {session?.user && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="ml-2 px-4 py-2 rounded-xl 
            bg-red-500 hover:bg-red-600 transition 
            text-white text-sm font-medium shadow"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}
