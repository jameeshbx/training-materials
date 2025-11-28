"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/usesocket";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activity, setActivity] = useState<any[]>([]);
  const [dbActivity, setDbActivity] = useState<any[]>([]);

  const userId = (session?.user as any)?.id;
  const userName = (session?.user as any)?.name;

  useSocket(userId, userName, (type, data) => {
    setActivity((prev) => [
      { action: type, userName: data.userName, details: data.details },
      ...prev,
    ]);
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    fetch("/api/activity")
      .then((res) => res.json())
      .then((json) => setDbActivity(json.data));
  }, []);

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard – Welcome {userName}
      </h1>

      {/* LIVE FEED */}
      <div className="bg-white p-5 shadow rounded-xl max-w-xl mb-10">
        <h2 className="font-bold text-xl mb-3">⚡ Live Activity Feed</h2>

        {activity.map((a, idx) => (
          <div key={idx} className="p-2 border-b">
            <strong>{a.userName}</strong> {a.action}
            {a.details && ` — ${a.details}`}
          </div>
        ))}
      </div>

      {/* DB FEED */}
      <div className="bg-white p-5 shadow rounded-xl max-w-xl">
        <h2 className="font-bold text-xl mb-3">📘 Activity History (Database)</h2>

        {dbActivity.map((a: any) => (
          <div key={a.id} className="p-2 border-b">
            <strong>{a.userName}</strong> {a.action}
            {a.details && ` — ${a.details}`}
            <div className="text-xs text-gray-500">
              {new Date(a.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




