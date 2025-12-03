"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErr(res.error);
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "ADMIN") router.push("/admin");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 text-black">
<div className="w-full max-w-md bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-xl rounded-2xl p-2 border">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email field */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              required
              className="w-full px-4 py-3 border rounded-xl bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              required
              className="w-full px-4 py-3 border rounded-xl bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-black hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            LOGIN
          </button>

          {/* Error message */}
          {err && (
            <p className="text-red-600 text-center text-sm mt-2">{err}</p>
          )}
        </form>

        {/* Optional footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Your App • Secure Login
        </p>
      </div>
    </div>
  );
}
