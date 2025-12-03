"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { Bell, CheckCircle, Inbox } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  seen: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data);
    } catch {
      console.log("Failed to fetch notifications");
    }
    setLoading(false);
  };

  const markAllRead = async () => {
    await fetch("/api/notifications/read", { method: "PATCH" });
    fetchNotifications();
  };

  // Real-time updates from socket
  useEffect(() => {
  fetchNotifications();

  socket.on("notification", () => {
    fetchNotifications();
  });

  return () => {
    socket.off("notification");
  };
}, []);


  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="text-blue-600" /> Notifications
          </h1>

          {notifications.some((n) => !n.seen) && (
            <button
              onClick={markAllRead}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Mark All Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Inbox className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            No notifications yet
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-4 rounded-lg border flex justify-between items-center transition ${
                  n.seen ? "bg-gray-100 border-gray-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div>
                  <p className="font-medium">{n.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {n.seen ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
