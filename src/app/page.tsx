
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user"); // keep default role (NO dropdown)
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const userRole = session?.user?.role;

    if (userRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl p-8 rounded-xl">
        <h2 className="text-xl font-semibold text-center mb-8">Sign In</h2>

        {/* All fields evenly spaced */}
        <div className="flex flex-col gap-6">

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Email</label>
            <Input
              placeholder="Enter your email"
              type="email"
              className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Password</label>
            <Input
              placeholder="Enter your password"
              type="password"
              className="bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ERROR */}
          {error && <p className="text-red-300 text-sm">{error}</p>}

          {/* LOGIN BUTTON */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3"
            onClick={handleLogin}
          >
            Login
          </Button>

          {/* REGISTER BUTTON */}
          <Link href="/register" className="block">
            <Button
              variant="secondary"
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3"
            >
              Register
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
