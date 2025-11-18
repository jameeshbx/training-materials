"use client";
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

export default function AdminDashboard() {
    const router=useRouter()
  const [user, setUser] = useState<any>(null);

 useEffect(() => {
    const cookieString = document.cookie;
    const isAdmin = cookieString.includes("admintoken=");

    if (!isAdmin) {
      router.replace("/login");
    }
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">👑 Admin Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Welcome, {user?.email} ({user?.role})
      </p>

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
