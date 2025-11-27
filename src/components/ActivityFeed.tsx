"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import moment from "moment";

type Activity = {
  id?: string;
  type: "taskCreated" | "login" | "logout" | "documentUploaded";
  userName: string;
  timestamp: string;
  taskTitle?: string;
  documentName?: string;
};

type ActivityFeedProps = {
  initialActivities?: Activity[];
};

let socket: any;

export default function ActivityFeed({ initialActivities = [] }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [online, setOnline] = useState(false);

  // Helper function to check if activities are duplicates
  const isDuplicate = (newActivity: Activity, existingActivities: Activity[]): boolean => {
    // For login activities, check if same user logged in within last 5 seconds
    if (newActivity.type === "login") {
      const recentLogin = existingActivities.find(
        (a) =>
          a.type === "login" &&
          a.userName === newActivity.userName &&
          Math.abs(new Date(a.timestamp).getTime() - new Date(newActivity.timestamp).getTime()) < 5000
      );
      return !!recentLogin;
    }
    
    // For other activities, check by ID if available, or by type + userName + timestamp
    if (newActivity.id) {
      return existingActivities.some((a) => a.id === newActivity.id);
    }
    
    // Fallback: check by type, userName, and timestamp (within 1 second)
    return existingActivities.some(
      (a) =>
        a.type === newActivity.type &&
        a.userName === newActivity.userName &&
        Math.abs(new Date(a.timestamp).getTime() - new Date(newActivity.timestamp).getTime()) < 1000
    );
  };

  useEffect(() => {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
      setOnline(true);
      console.log("🟢 Connected to socket");
    });

    socket.on("disconnect", () => setOnline(false));

    socket.on("activity", (activity: Activity) => {
      console.log("📥 REALTIME ACTIVITY:", activity);
      setActivities((prev) => {
        // Check if this activity is a duplicate before adding
        if (isDuplicate(activity, prev)) {
          console.log("⚠️ Duplicate activity detected, skipping:", activity);
          return prev;
        }
        return [activity, ...prev];
      });
    });

    return () => {
      socket.off("activity");
      socket.disconnect();
    };
  }, []);

  const formatActivity = (activity: Activity) => {
    const time = moment(activity.timestamp).format("DD/MM/YYYY, hh:mm:ss a");

    switch (activity.type) {
      case "taskCreated":
        return (
          <div className="flex gap-3 py-2 border-b border-gray-700">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex justify-center items-center">📝</div>
            <div>
              <p className="text-sm">
                <span className="font-semibold">{activity.userName}</span> created task{" "}
                <span className="text-blue-300 font-medium">"{activity.taskTitle}"</span>
              </p>
              <p className="text-gray-400 text-xs">{time}</p>
            </div>
          </div>
        );

      case "login":
        return (
          <div className="flex gap-3 py-2 border-b border-gray-700">
            <div className="w-8 h-8 bg-green-600 rounded-full flex justify-center items-center">🟢</div>
            <div>
              <p className="text-sm font-semibold">{activity.userName} logged in</p>
              <p className="text-gray-400 text-xs">{time}</p>
            </div>
          </div>
        );

      case "logout":
        return (
          <div className="flex gap-3 py-2 border-b border-gray-700">
            <div className="w-8 h-8 bg-red-600 rounded-full flex justify-center items-center">🔴</div>
            <div>
              <p className="text-sm font-semibold">{activity.userName} logged out</p>
              <p className="text-gray-400 text-xs">{time}</p>
            </div>
          </div>
        );

      case "documentUploaded":
        return (
          <div className="flex gap-3 py-2 border-b border-gray-700">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex justify-center items-center">📄</div>
            <div>
              <p className="text-sm">
                <span className="font-semibold">{activity.userName}</span> uploaded document{" "}
                <span className="text-purple-300 font-medium">"{activity.documentName}"</span>
              </p>
              <p className="text-gray-400 text-xs">{time}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-md mt-4">
      <h2 className="text-xl font-bold mb-2">
        🔔 Live Activity Feed{" "}
        <span className={online ? "text-green-400" : "text-yellow-400"}>
          ● {online ? "Online" : "Offline"}
        </span>
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-400">No activities yet</p>
      ) : (
        <div className="space-y-1">
          {activities.map((activity, index) => (
            <div key={index}>{formatActivity(activity)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
