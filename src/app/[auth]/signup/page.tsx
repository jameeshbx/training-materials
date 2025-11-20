"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");     // 👈 ADD THIS
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),  // 👈 SEND ROLE
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Something went wrong");
      return;
    }

    router.push("/auth/login"); // redirect to login
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-80 md:w-88 bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-6">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-4">
          Signup to continue
        </p>

        <form onSubmit={handleSignup} className="space-y-3">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700"
            />
          </div>

          {/* ROLE DROPDOWN (moved BEFORE submit button) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700">Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}    // 👈 STORE ROLE
              className="w-full p-2 border rounded bg-white text-black"
              required
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-md font-semibold mt-4"
          >
            Signup
          </button>

        </form>

      </div>
    </div>
  );
}
