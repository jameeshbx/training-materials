"use client";

import { useEffect, useState } from "react";

export default function TaskTimer({ taskId }: { taskId: number }) {
  const [runningId, setRunningId] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  // Load existing timer from backend (resume after refresh)
  useEffect(() => {
    const fetchEntry = async () => {
      const res = await fetch(`/api/time-entries?taskId=${taskId}`);
      const entry = await res.json();

      if (entry?.data && entry.data.startTime && !entry.data.endTime) {
        setRunningId(entry.data.id);

        // Calculate time difference since start
        const start = new Date(entry.data.startTime).getTime();
        const now = Date.now();
        const diff = Math.floor((now - start) / 1000);

        setSeconds(diff);
      }
    };

    fetchEntry();
  }, [taskId]);

  // Timer ticking
  useEffect(() => {
    if (!runningId) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [runningId]);

  const start = async () => {
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });

    const result = await res.json();
    setRunningId(result.data.id);
    setSeconds(0);
  };

  const stop = async () => {
    if (!runningId) return;

    await fetch("/api/time-entries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: runningId }),
    });

    setRunningId(null);
  };

  const formatTime = (s: number) =>
    new Date(s * 1000).toISOString().substr(11, 8);

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-blue-50 border-b">
      <div className="font-mono text-lg text-blue-700">
        {formatTime(seconds)}
      </div>

      <button
        onClick={runningId ? stop : start}
        className={`px-4 py-1 text-sm rounded-md font-semibold text-white transition ${
          runningId
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {runningId ? "Stop" : "Start"}
      </button>
    </div>
  );
}
