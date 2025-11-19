"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useRouter } from 'next/navigation';
import Link from "next/link";

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

        setMessage("User created successfully! Redirecting...");
        setTimeout(() => router.push("/"), 1500);
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen px-4">
            <Card className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-10 rounded-xl min-h-[420px]">

                <div className="flex flex-col gap-6">

                    <div className="flex flex-col gap-5">
                        <Input 
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 h-12 px-4"
                        />

                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 h-12 px-4"
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 h-12 px-4"
                        />
                    </div>

                    <div className="min-h-6">
                        {error && (
                            <p className="text-red-400 text-center text-sm">{error}</p>
                        )}

                        {message && (
                            <p className="text-green-400 text-center text-sm">{message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={handleRegister}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg"
                        >
                            Register
                        </Button>

                        <p className="text-center text-gray-300 text-sm">
                            Already have an account?{" "}
                            <Link href="/" className="text-blue-400 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>

                </div>
            </Card>
        </div>
    );
}



