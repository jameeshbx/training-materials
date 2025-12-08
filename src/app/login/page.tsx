"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";


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
  <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-white to-slate-200 text-black">
    
    {/* LEFT: Image / Branding */}
    <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center relative">
      <img
        src="https://media.istockphoto.com/id/1416166344/photo/cyber-security-concept-businessmen-protecting-personal-data-on-laptop-and-virtual-interfaces.jpg?s=2048x2048&w=is&k=20&c=qF974dicquwAdSjNpGm_oF4pf4VPiMxonNkFX8GCXT4=" 
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="relative z-10 text-white text-center px-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-gray-200 text-lg">
          Securely manage your tasks and workflow.
        </p>
      </div>
      <div className="absolute inset-0 bg-black/40"></div>
    </div>

    {/* RIGHT: Login Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-slate-200">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your account securely
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {err && (
            <p className="text-red-600 text-sm text-center">{err}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          New here?{" "}
          <Link
            href="/signup"
            className="text-gray-900 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Your App • Secure Login
        </p>
      </div>
    </div>
  </div>
);
}