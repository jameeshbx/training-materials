"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "USER", // default role
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // FIXED
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      setError("Server error");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Signup | App</title>
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="w-14 h-14 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="bg-red-100 text-red-600 text-sm py-2 px-3 rounded">
                {error}
              </p>
            )}

            {success && (
              <p className="bg-green-100 text-green-600 text-sm py-2 px-3 rounded">
                Account created successfully! Redirecting...
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="user name"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 text-black focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 text-black focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 text-black focus:border-blue-500"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border rounded-md text-black focus:ring-blue-500"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-2 font-medium rounded-md transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-black hover:bg-green-400 hover:text-black text-green-300"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
