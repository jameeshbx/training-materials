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
    <div className="p-6 text-black space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {userName} 👋</h1>

      {/* Today’s Tasks */}
      <div className="bg-white p-6 shadow-lg rounded-2xl border max-w-3xl">
        <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
          📅 Tasks Due Today
        </h2>

        {todayTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks due today 🎉</p>
        ) : (
          <ul className="space-y-3">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{task.title}</span>
                  <span className="text-sm text-blue-600 font-semibold">
                    Due: {new Date(task.dueDate!).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white p-6 shadow-lg rounded-2xl border max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">⚡ Live Activity Feed</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No recent activities.
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-blue-600">
                        {activity.userName}
                      </strong>
                      <span className="text-gray-700">{activity.action}</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 shadow rounded-2xl border">
          <h3 className="text-sm text-gray-500 mb-2">Total Activities</h3>
          <p className="text-3xl font-bold text-blue-600">
            {activities.length}
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-2xl border">
          <h3 className="text-sm text-gray-500 mb-2">Today's Activities</h3>
          <p className="text-3xl font-bold text-green-600">
            {
              activities.filter((a) =>
                new Date(a.createdAt).toDateString() ===
                new Date().toDateString()
              ).length
            }
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded-2xl border">
          <h3 className="text-sm text-gray-500 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(activities.map((a) => a.userName)).size}
          </p>
        </div>
      </div>
    </div>
  );
}
