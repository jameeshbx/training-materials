"use client";

import Link from "next/link";
import ActivityFeed from "@/components/ActivityFeed";

type DashboardClientProps = {
  todaysTasks: any[];
  role: string | undefined;
  initialActivities: any[];
  userName: string | null | undefined;
};

export default function DashboardClient({
  todaysTasks,
  role,
  initialActivities,
  userName,
}: DashboardClientProps) {
  return (
    <div className="p-6 text-white">
      
      {/* Greeting */}
      <h1 className="text-3xl font-bold mb-1">Hi, {userName || "User"} 👋</h1>
      <p className="text-gray-300 mb-4">Welcome back to your dashboard!</p>

      {role === "ADMIN" && (
        <Link
          href="/admin/users"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white mb-6 inline-block"
        >
          👤 View All Users
        </Link>
      )}

      {/* LIVE ACTIVITY FEED */}
      <ActivityFeed initialActivities={initialActivities} />

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Today's Due Tasks</h2>

        {todaysTasks.length === 0 ? (
          <p>No tasks due today.</p>
        ) : (
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <div key={task.id} className="bg-slate-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.dueDate && (
                  <p className="text-gray-300 text-sm">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
