"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/login");
  };

return (
  <div className="min-h-screen flex bg-gradient-to-br from-slate-100 via-white to-slate-200 text-black">
    
    {/* LEFT: Image / Branding */}
    <div className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center relative">
      <img
        src="/signup-bg.jpg"
        alt="Signup Background"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="relative z-10 text-white text-center px-10">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Join Our Platform
        </h1>
        <p className="text-gray-200 text-lg">
          Create your account and get started instantly.
        </p>
      </div>
      <div className="absolute inset-0 bg-black/40"></div>
    </div>

    {/* RIGHT: Signup Form */}
    <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-slate-200">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Join us and manage your work professionally
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder=""
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:outline-none"
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
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-900 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}