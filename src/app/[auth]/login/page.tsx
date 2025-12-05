"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Global error handler for uncaught errors (like URL construction errors)
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Check if it's a URL construction error (likely from rate limiting)
      if (event.error?.message?.includes("Failed to construct 'URL'") || 
          event.error?.message?.includes("Invalid URL")) {
        event.preventDefault(); // Prevent the error from showing in console
        setErrorMsg("Too many login attempts. Please wait a minute before trying again.");
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if it's a URL construction error
      if (event.reason?.message?.includes("Failed to construct 'URL'") || 
          event.reason?.message?.includes("Invalid URL") ||
          event.reason?.message?.includes("429")) {
        event.preventDefault(); // Prevent the error from showing in console
        setErrorMsg("Too many login attempts. Please wait a minute before trying again.");
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(""); // Clear previous errors

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        // Check if it's a rate limit error
        if (res.error === "Too many requests" || 
            res.error.includes("rate limit") || 
            res.error.includes("429")) {
          setErrorMsg("Too many login attempts. Please wait a minute before trying again.");
        } else {
          setErrorMsg("Invalid email or password");
        }
        return;
      }

      if (res?.ok) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      // Handle network errors or other exceptions
      console.error("Login error:", error);
      
      // Check if it's a rate limit error
      if (error?.message?.includes("429") || 
          error?.message?.includes("rate limit") || 
          error?.message?.includes("Too many requests") ||
          error?.message?.includes("Failed to construct 'URL'") || 
          error?.message?.includes("Invalid URL")) {
        setErrorMsg("Too many login attempts. Please wait a minute before trying again.");
      } else {
        setErrorMsg("An error occurred. Please try again.");
      }
    }
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-center text-sm font-medium">
                {errorMsg}
              </p>
            </div>
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
