
"use client";

import Link from "next/link";
import { FaTasks, FaUsers, FaChartLine } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#dff2ff] via-[#b8e2f5] to-[#a7d8f0]">

      {/* Top Navigation */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-bold text-blue-900">Task Manager</h1>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-blue-700 font-medium hover:underline">
            Login
          </Link>
          <Link href="/register" className="text-blue-700 font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center mt-16 px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
          Organize. Track. Achieve More.
        </h1>

        <p className="mt-4 text-gray-700 max-w-2xl text-lg sm:text-xl">
          Your smart workspace to manage tasks, boost productivity,
          and help your team work efficiently.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg text-lg transition"
          >
            Get Started
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-100 rounded-xl shadow text-lg transition"
          >
            Create Account
          </Link>
        </div>

        {/* Feature Cards Section */}
        <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full px-4">

          {/* Card 1 */}
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition">
            <FaTasks className="text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Track Tasks</h3>
            <p className="text-gray-600 mt-2 text-center">
              Easily manage and organize your tasks with powerful tools.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition">
            <FaUsers className="text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Team Collaboration</h3>
            <p className="text-gray-600 mt-2 text-center">
              Work together efficiently and boost team productivity.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition">
            <FaChartLine className="text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">Productivity Insights</h3>
            <p className="text-gray-600 mt-2 text-center">
              Understand your progress with smart analytics.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-700 text-sm">
        © 2025 Task Manager. All rights reserved.
      </footer>
    </div>
  );
}
