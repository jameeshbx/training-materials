"use client"
import { ChangeEvent, FormEvent, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"


interface LoginForm {
  email: string
  password: string
}
export default function Login() {
  const router = useRouter()

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,  
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post(
  "/api/auth/login",
  formData,
  { withCredentials: true }
);

if (response.data.success) {
    console.log(response.data,"response.data");
    
    if (response.data.success) {
  router.push("/dashboard");
}

}
       else {
        setError(response.data.message || "Invalid credentials")
      }

    } catch (err) {
      setError("Login failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login | App</title>
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="w-14 h-14 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Welcome Back 
            </h2>
            <p className="text-gray-500 text-sm">
              Login to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <p className="bg-red-100 text-red-600 text-sm py-2 px-3 rounded">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-1 w-full px-3 py-2 border rounded-md focus:ring-blue-500 text-black focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
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

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-2 font-medium rounded-md transition ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-black hover:bg-green-400 hover:text-black text-green-300"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                Create one
              </Link>
            </div>
          </form>

          {/* Social Auth */}
          <div className="mt-6">
            <div className="flex items-center justify-center gap-3">
              <button className="border px-4 py-2 rounded-lg bg-black w-full text-green-500">
                Google
              </button>
              <button className="border px-4 py-2 rounded-lg bg-black text-green-500 w-full">
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
