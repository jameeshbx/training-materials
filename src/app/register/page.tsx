
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
        setTimeout(() => router.push("/"), 1500)
    }

    return (
        <div className="flex items-center justify-center w-full min-h-screen px-4 sm:px-6">
            <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-6 sm:p-8 md:p-10 rounded-lg sm:rounded-xl">
                <div className="flex flex-col gap-5 sm:gap-6">
                    {/* Input fields section - responsive spacing */}
                    <div className="flex flex-col gap-4 sm:gap-5">
                        <Input
                            placeholder="Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 h-10 sm:h-12 px-4 text-sm sm:text-base rounded"
                        />

                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 h-10 sm:h-12 px-4 text-sm sm:text-base rounded"
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/20 text-white placeholder-gray-300 border border-white/30 h-10 sm:h-12 px-4 text-sm sm:text-base rounded"
                        />
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-12 px-4 rounded bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="user" className="text-black">User</option>
                            <option value="admin" className="text-black">Admin</option>
                        </select>
                    </div>

                    {/* Error/Success message section */}
                    <div className="min-h-6">
                        {error && <p className="text-red-400 text-center text-xs sm:text-sm">{error}</p>}

                        {message && <p className="text-green-400 text-center text-xs sm:text-sm">{message}</p>}
                    </div>

                    {/* Button section - responsive sizing and spacing */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <Button
                            onClick={handleRegister}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base"
                        >
                            Register
                        </Button>

                        <p className="text-center text-gray-300 text-xs sm:text-sm">
                            Already have an account?{" "}
                            <Link href="/" className="text-blue-400 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}




