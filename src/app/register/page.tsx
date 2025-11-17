// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";

// export default function RegisterPage() {
//     return (
//         <div className="flex items-center justify-center w-full min-h-screen">
//             <Card className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-6">
//                 <div className="space-y-5">
//                     <Input
//                         placeholder="Name"
//                         type="text"
//                         className="bg-white/20 text-white placeholder-gray-300 border border-white/30"
//                     />
//                     <Input
//                         placeholder="Email"
//                         type="email"
//                         className="bg-white/20 text-white placeholder-gray-300 border border-white/30"
//                     />
//                     <Input
//                         placeholder="Password"
//                         type="password"
//                         className="bg-white/20 text-white placeholder-gray-300 border border-white/30"
//                     />

//                     <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold">
//                         Register
//                     </Button>

//                     <p className="text-center text-gray-300">
//                         Already have an account?{" "}
//                         <Link href="/" className="text-blue-400 hover:underline">
//                             Login
//                         </Link>
//                     </p>
//                 </div>
//             </Card>
//         </div>
//     );
// }
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleRegister() {
        setError("");
        setMessage("");

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || "Signup failed");
            return;
        }

        // Success
        setMessage("User created successfully! Redirecting...");
        setTimeout(() => router.push("/"), 1500);
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Card className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-6">
                <div className="space-y-5">

                    <Input
                        placeholder="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/20 text-white placeholder-gray-300 border border-white/30"
                    />

                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/20 text-white placeholder-gray-300 border border-white/30"
                    />

                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/20 text-white placeholder-gray-300 border border-white/30"
                    />

                    {/* Error message */}
                    {error && (
                        <p className="text-red-400 text-center">{error}</p>
                    )}

                    {/* Success message */}
                    {message && (
                        <p className="text-green-400 text-center">{message}</p>
                    )}

                    <Button
                        onClick={handleRegister}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                        Register
                    </Button>

                    <p className="text-center text-gray-300">
                        Already have an account?{" "}
                        <Link href="/" className="text-blue-400 hover:underline">
                            Login
                        </Link>
                    </p>

                </div>
            </Card>
        </div>
    );
}
