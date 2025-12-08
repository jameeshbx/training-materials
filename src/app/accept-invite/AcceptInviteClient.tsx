"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function AcceptInviteClient() {
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

        const loginRes = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (loginRes?.error) {
            toast.error("Auto login failed");
            setLoading(false);
            return;
        }

        toast.success("Invitation accepted! Redirecting...");
        router.push("/dashboard");
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="p-8 bg-white border rounded-xl shadow-lg w-full max-w-sm text-center">
                <h1 className="text-xl font-bold mb-4">Accept Invitation</h1>

                <p className="text-gray-600 mb-6">
                    Click below to accept the invitation and join the app.
                </p>

                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Accepting..." : "Accept Invitation"}
                </button>
            </div>
        </div>
    );
}
