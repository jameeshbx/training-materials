

// "use client";

// import { signOut, useSession } from "next-auth/react";


// export default function Header() {
//     const { data: session } = useSession();

//     return (
//         <div className="w-full h-16 flex items-center justify-between bg-white px-4 sm:px-6">
//             {/* Title */}
//             <h1 className="text-xl font-semibold text-gray-800">Header</h1>

//             {/* Right Side: Language + Logout */}
//             <div className="flex items-center gap-4">
//                 {/* ✅ Language Switcher */}

//                 {/* ✅ Logout Button */}
//                 {session?.user && (
//                     <button
//                         onClick={() => signOut({ callbackUrl: "/" })}
//                         className="bg-red-600 text-white px-4 py-2 rounded-md"
//                     >
//                         Logout
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }

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
                    className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                    EN
                </button>

                <button
                    onClick={() => setLocale("es")}
                    className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                    ES
                </button>

                {/* ✅ Logout Button */}
                {session?.user && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}
