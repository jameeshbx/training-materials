"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  if (loading)
    return (
      <p className="p-10 text-center text-gray-500 text-lg animate-pulse">
        Loading users...
      </p>
    );

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          All Users
        </h1>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-300">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Role</th>
                <th className="p-3 border-b">Tasks</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                >
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b font-medium">
                    {user.role === "ADMIN" ? (
                      <span className="px-2 py-1 text-xs bg-black text-white rounded">
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded">
                        USER
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-b">{user.tasks?.length ?? 0}</td>

                  <td className="p-3 border-b text-center">
                    <button
                      className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
