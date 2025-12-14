
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [role, setRole] = useState("user");

    async function handleRegister() {
        setError("")
        setMessage("")

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.message || "Signup failed")
            return
        }

        setMessage("User created successfully! Redirecting...")
        setTimeout(() => router.push("/login"), 1500)
    }


    return (
        <div className="flex items-center justify-center w-full min-h-screen px-4 sm:px-6">
            <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white border border-gray-200 text-gray-900 shadow-2xl p-6 sm:p-8 md:p-10 rounded-lg sm:rounded-xl">
                <div className="flex flex-col gap-5 sm:gap-6">

                    <div className="flex flex-col gap-4 sm:gap-5">
                        <Input
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white text-gray-900 placeholder-gray-400 border border-gray-400 h-10 sm:h-12 px-4 text-sm sm:text-base rounded focus:ring-2 focus:ring-blue-500"
                        />

                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white text-gray-900 placeholder-gray-400 border border-gray-400 h-10 sm:h-12 px-4 text-sm sm:text-base rounded focus:ring-2 focus:ring-blue-500"
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white text-gray-900 placeholder-gray-400 border border-gray-400 h-10 sm:h-12 px-4 text-sm sm:text-base rounded focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-12 px-4 rounded bg-white text-gray-900 border border-gray-400 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="min-h-6">
                        {error && (
                            <p className="text-red-600 text-center text-xs sm:text-sm">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p className="text-green-600 text-center text-xs sm:text-sm">
                                {message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4">
                        <Button
                            onClick={handleRegister}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base"
                        >
                            Register
                        </Button>

                        <p className="text-center text-gray-700 text-xs sm:text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>

                </div>
            </Card>
        </div>
    );

}




