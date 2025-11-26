"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
  try {
    const res = await fetch("/api/admin/users");
    const data = await res.json();

    console.log("ADMIN API RESPONSE:", data); 

    if (!res.ok) {
      console.error("Admin API error:", data);
      setUsers([]);
    } else if (Array.isArray(data)) {
      setUsers(data);
    } else if (data && Array.isArray((data as any).users)) {
      setUsers((data as any).users);
    } else {
      
      console.warn("Admin API returned unexpected shape, expected array.", data);
      setUsers([]);
    }
  } catch (err) {
    console.error("Failed to fetch admin data:", err);
  }
  setLoading(false);
};

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">👨‍💼 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <div
            key={user.id}
            className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition"
          >
           
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-gray-600 mb-3">{user.email}</p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {user.tasks.length} Tasks
              </span>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                User ID: {user.id.slice(0, 6)}...
              </span>
            </div>

          
            <h3 className="text-lg font-semibold mb-2">Tasks:</h3>

            {user.tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks found.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {user.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                  >
                    <h4 className="font-semibold text-md">{task.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {task.description || "No description"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          task.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : task.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

