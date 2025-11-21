"use client";

import { useEffect, useState } from "react";

interface Entry {
  id: string;
  startedAt: string;
  endedAt: string;
  hours: number;
}

export default function TimeEntryList({ taskId }: { taskId: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEntries() {
    try {
      const res = await fetch(`/api/time-entries?taskId=${taskId}`);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load time entries:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading time logs…</p>;
  }

  if (entries.length === 0) {
    return <p className="text-gray-400 text-sm">No time entries yet.</p>;
  }

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="mt-4 bg-slate-900 p-3 rounded-lg border border-slate-700">
      <h3 className="text-sm font-semibold text-gray-200 mb-2">
        Time Entries
      </h3>

      <div className="space-y-2 text-sm">
        {entries.map((e) => (
          <div
            key={e.id}
            className="flex justify-between bg-slate-800 p-2 rounded-md"
          >
            <div>
              <p className="text-gray-300">
                Start:{" "}
                <span className="text-white">
                  {new Date(e.startedAt).toLocaleTimeString()}
                </span>
              </p>
              <p className="text-gray-300">
                End:{" "}
                <span className="text-white">
                  {new Date(e.endedAt).toLocaleTimeString()}
                </span>
              </p>
            </div>

            <p className="text-emerald-400 font-semibold">
              {e.hours.toFixed(2)} h
            </p>
          </div>
        ))}
      </div>

      {/* TOTAL HOURS */}
      <p className="text-sm text-emerald-400 font-semibold mt-3">
        Total Time Spent: {totalHours.toFixed(2)} hours
      </p>
    </div>
  );
}
