
"use client";
import { signOut } from "next-auth/react";

export default function AdminClientPage({ session }: any) {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">👑 Admin Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Welcome, {session.user.email} ({session.user.role})
      </p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="border rounded p-4 shadow hover:bg-gray-100 cursor-pointer">
          <h2 className="font-semibold">📌 Manage Users</h2>
          <p className="text-sm text-gray-500">View, edit and delete users</p>
        </div>

        <div className="border rounded p-4 shadow hover:bg-gray-100 cursor-pointer">
          <h2 className="font-semibold">📊 Reports</h2>
          <p className="text-sm text-gray-500">View activity reports</p>
        </div>

        <div className="border rounded p-4 shadow hover:bg-gray-100 cursor-pointer">
          <h2 className="font-semibold">⚙️ Settings</h2>
          <p className="text-sm text-gray-500">System settings</p>
        </div>
      </div>
    </div>
  );
}
