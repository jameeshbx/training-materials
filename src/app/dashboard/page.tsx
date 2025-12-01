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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = (session?.user as any)?.id;
  const userName = (session?.user as any)?.name;

  // Setup socket connection and listen for real-time activities
  useSocket(userId, userName, (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch initial activities from database
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

  if (status === "loading" || loading) {
    return (
      <div className="p-6 text-black">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard – Welcome {userName}
      </h1>

      {/* LIVE ACTIVITY FEED */}
      <div className="bg-white p-5 shadow rounded-xl max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl">⚡ Activity Feed</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No activities yet. Start creating tasks!
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-blue-600">
                        {activity.userName}
                      </strong>
                      <span className="text-gray-700">{activity.action}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STATS SECTION (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-5 shadow rounded-xl">
          <h3 className="text-sm text-gray-500 mb-2">Total Activities</h3>
          <p className="text-3xl font-bold text-blue-600">
            {activities.length}
          </p>
        </div>
        <div className="bg-white p-5 shadow rounded-xl">
          <h3 className="text-sm text-gray-500 mb-2">Today's Activities</h3>
          <p className="text-3xl font-bold text-green-600">
            {
              activities.filter((a) => {
                const today = new Date().toDateString();
                return new Date(a.createdAt).toDateString() === today;
              }).length
            }
          </p>
        </div>
        <div className="bg-white p-5 shadow rounded-xl">
          <h3 className="text-sm text-gray-500 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(activities.map((a) => a.userName)).size}
          </p>
        </div>
      </div>
    </div>
  );
}