


"use client";

import { signOut, useSession } from "next-auth/react";

export default function Header() {
    const { data: session } = useSession();

    return (
        <div className="w-full h-16 bg-white shadow flex items-center px-6 justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Header</h1>

            {session?.user && (
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            )}
        </div>
    );
}



