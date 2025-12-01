
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  // -----------------------------------------------------
  // LOAD USERS (Admin list)
  // -----------------------------------------------------
  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Admin user fetch error:", err);
      setUsers([]);
    }

    setLoadingUsers(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // -----------------------------------------------------
  // SEND INVITE (EMAIL SYSTEM)
  // -----------------------------------------------------
  const sendInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setInviteLoading(true);

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send invite");
      } else {
        toast.success(`Invitation sent to ${inviteEmail}`);
        setInviteEmail("");
      }
    } catch (err) {
      toast.error("Failed to send invite");
    }

    setInviteLoading(false);
  };

  // -----------------------------------------------------
  // UI
  // -----------------------------------------------------
  if (loadingUsers) {
    return (
      <div className="p-6 text-center text-xl font-semibold">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">👨‍💼 Admin Dashboard</h1>

      <div className="mt-4">
        <button
          onClick={() => (window.location.href = "/admin/audit-logs")}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
        >
          📜 View Audit Logs
        </button>
      </div>


      {/* Invite Section */}
      <div className="max-w-xl bg-white p-5 rounded-xl shadow border">
        <h2 className="text-xl font-bold mb-3">📩 Invite a User</h2>

        <input
          type="email"
          placeholder="Enter email address..."
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="w-full border-black p-2 rounded-lg mb-3 text-black"
        />

        <button
          onClick={sendInvite}
          disabled={inviteLoading}
          className={`px-4 py-2 rounded-lg text-white 
            ${inviteLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {inviteLoading ? "Sending email..." : "Send Invite"}
        </button>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {users.map((user: any) => (
          <div
            key={user.id}
            className="border rounded-xl p-5 bg-white shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600 mb-3">{user.email}</p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {user.tasks.length} Tasks
              </span>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                ID: {user.id.slice(0, 6)}...
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
                    <h4 className="font-semibold">{task.title}</h4>

                    <p className="text-sm text-gray-600">
                      {task.description || "No description"}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "N/A"}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded ${task.status === "COMPLETED"
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

