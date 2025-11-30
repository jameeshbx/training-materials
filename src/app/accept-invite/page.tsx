
// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";

// export default function AcceptInvitePage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     const token = searchParams.get("token");
//     const [loading, setLoading] = useState(false);

//     const handleAccept = async () => {
//         if (!token) {
//             toast.error("Invalid or missing token.");
//             return;
//         }

//         setLoading(true);

//         const res = await fetch("/api/accept-invite", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ token }),
//             credentials: "include",   // ⭐⭐ IMPORTANT
//         });

//         const data = await res.json();

//         if (data.success) {
//             toast.success("Invite accepted! Redirecting...");
//             setTimeout(() => {
//                 router.push("/dashboard");
//             }, 1200);
//         } else {
//             toast.error(data.error || "Something went wrong");
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-50">
//             <div className="p-6 bg-white border rounded-lg shadow-md w-full max-w-sm text-center">
//                 <h1 className="text-xl font-bold mb-4">Accept Invitation</h1>
//                 <p className="text-gray-600 mb-4">
//                     Click below to accept the invitation and join the app.
//                 </p>

//                 <button
//                     onClick={handleAccept}
//                     disabled={loading}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                 >
//                     {loading ? "Accepting..." : "Accept Invitation"}
//                 </button>
//             </div>
//         </div>
//     );
// }


"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function AcceptInvitePage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        if (!token) {
            toast.error("Invalid or missing token.");
            return;
        }

        setLoading(true);

        // 1️⃣ CALL BACKEND TO ACCEPT INVITE
        const res = await fetch("/api/accept-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!data.success) {
            toast.error(data.error || "Something went wrong");
            setLoading(false);
            return;
        }

        // 2️⃣ AUTO LOGIN USING NEXT-AUTH (Frontend)
        const loginRes = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false, // VERY IMPORTANT
        });

        if (loginRes?.error) {
            toast.error("Auto login failed");
            setLoading(false);
            return;
        }

        // 3️⃣ REDIRECT TO DASHBOARD
        toast.success("Invitation accepted! Redirecting...");
        router.push("/dashboard");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="p-6 bg-white border rounded-lg shadow-md w-full max-w-sm text-center">
                <h1 className="text-xl font-bold mb-4">Accept Invitation</h1>
                <p className="text-gray-600 mb-4">
                    Click below to accept the invitation and join the app.
                </p>

                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Accepting..." : "Accept Invitation"}
                </button>
            </div>
        </div>
    );
}
