"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={() => router.push("/admin/users")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        View Users
      </button>
    </div>
  );
}
