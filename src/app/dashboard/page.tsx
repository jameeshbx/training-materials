"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/usesocket";

interface Activity {
  id: string;
  userId: string | null;
  userName: string;
  action: string;
  createdAt: string;
}

type Task = {
  id: string;
  title: string;
  dueDate?: string | null;
  userId: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = (session?.user as any)?.id;
  const userName = (session?.user as any)?.name;

  // Live activity feed via WebSocket
  useSocket(userId, userName, (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch activities
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/activity")
        .then((res) => res.json())
        .then((json) => {
          setActivities(json.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch activities:", err);
          setLoading(false);
        });
    }
  }, [status]);

  // Fetch today’s tasks
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((json) => {
        const allTasks: Task[] = json.data;

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth();
        const dd = today.getDate();

        const todayOnly = allTasks.filter((t) => {
          if (!t.dueDate) return false;

          const d = new Date(t.dueDate);
          return d.getFullYear() === yyyy && d.getMonth() === mm && d.getDate() === dd;
        });

        setTodayTasks(todayOnly);
      });
  }, [userId]);

  if (status === "loading" || loading) {
    return (
      <div className="p-6 text-black">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
  <div className="p-6 md:ml-[260px] mt-[80px] min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50">

    {/* Welcome Section */}
    <div className="mb-10">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 ">
        Welcome back, <span className="text-blue-600">{userName}</span> 👋
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        Here's what's happening today at a glance.
      </p>
    </div>

    {/* Top Stats Row */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
        <h3 className="text-sm text-gray-500 mb-1">Total Activities</h3>
        <p className="text-4xl font-bold text-blue-600">{activities.length}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
        <h3 className="text-sm text-gray-500 mb-1">Today's Activities</h3>
        <p className="text-4xl font-bold text-green-600">
          {
            activities.filter((a) =>
              new Date(a.createdAt).toDateString() === new Date().toDateString()
            ).length
          }
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
        <h3 className="text-sm text-gray-500 mb-1">Active Users</h3>
        <p className="text-4xl font-bold text-purple-600">
          {new Set(activities.map((a) => a.userName)).size}
        </p>
      </div>
    </div>

    {/* Two Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Tasks Due Today */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
        <h2 className="text-2xl font-semibold flex items-center gap-1 mb-1">
          📅 Tasks Due Today
        </h2>

        {todayTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks due today 🎉</p>
        ) : (
          <ul className="space-y-3">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="p-4 rounded-xl bg-gray-50 border shadow hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{task.title}</span>
                  <span className="text-sm font-semibold text-blue-600">
                    Due: {new Date(task.dueDate!).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Activity Feed */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">⚡ Live Activity Feed</h2>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>

        {activities.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            No recent activity recorded.
          </p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border rounded-xl bg-gray-50 shadow-sm hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600">
                        {activity.userName}
                      </span>
                      <span className="text-gray-700">{activity.action}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
