"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setErrorMsg("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="p-8 w-80 md:w-96 bg-white rounded-2xl shadow-lg border border-gray-200">

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Please login to continue
        </p>

        <form onSubmit={handleLogin}>
          {/* Email */}
        
            {/* <label className="block  text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full  rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            /> */}
         

          {/* Password */}
          
            {/* <label className="block  text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-6 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
           */}


          {/* Email */}
<label
  htmlFor="email"
  className="block text-sm font-medium text-gray-700"
>
  Email
</label>
<input
  id="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="w-full rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
/>

{/* Password */}
<label
  htmlFor="password"
  className="block text-sm font-medium text-gray-700"
>
  Password
</label>
<input
  id="password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  className="w-full p-6 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
/>



          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-600 text-center text-sm mb-3">
              {errorMsg}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-teal-700 hover:bg-teal-800 transition text-white py-3 rounded-lg font-semibold text-sm mt-4"
          >
            Login
          </button>

  
        </form>
      </div>
    </div>
  );
}
