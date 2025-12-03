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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center px-1">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-4 border border-gray-200">
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-1.5">

          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-0.5 text-sm font-medium">Name</label>
            <input
              type="text"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-0.5 text-sm font-medium">Email</label>
            <input
              type="email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-0.5 text-sm font-medium">Password</label>
            <input
              type="password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
              placeholder="Enter your password"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 mb-0.5 text-sm font-medium">User Type</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-600 mt-3 text-sm">
          Already have an account?
          <Link href="/login" className="text-gray-900 ml-1 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
