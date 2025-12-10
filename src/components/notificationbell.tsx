"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: string;
  userId?: string | null;
  userName: string;
  action: string;
  createdAt: string;
};

export default function NotificationBell() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchActivities() {
    try {
      const res = await fetch("/api/activities/recent");
      if (!res.ok) return;
      const data: Activity[] = await res.json();
      setActivities(data);
    } catch (err) {
      // ignore
    }
  }

  useEffect(() => {
    fetchActivities();
    const id = setInterval(fetchActivities, 10000); // 10s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-full bg-white shadow">
        
      </button>


      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 p-3">
          <h4 className="font-semibold mb-2">Recent Activity</h4>
          <div className="space-y-2 max-h-64 overflow-auto">
            {activities.length === 0 && <div className="text-sm text-slate-500">No recent activity</div>}
            {activities.map((a) => (
              <div key={a.id} className="text-sm">
                <div className="font-medium">{a.userName}</div>
                <div className="text-slate-600">{a.action}</div>
                <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
