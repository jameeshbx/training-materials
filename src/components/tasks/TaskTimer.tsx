"use client";

import { useEffect, useState } from "react";

export default function TaskTimer({ taskId }: { taskId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Load saved timer state on mount
  useEffect(() => {
    const savedEntryId = localStorage.getItem("entryId");
    const savedStart = localStorage.getItem("startTime");

    if (savedEntryId && savedStart) {
      setEntryId(savedEntryId);
      setStartTime(Number(savedStart));
      setIsRunning(true);
      const diff = Math.floor((Date.now() - Number(savedStart)) / 1000);
      setSeconds(diff > 0 ? diff : 0);
    }
  }, []);

  // Timer interval
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - (startTime || 0)) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  // Start Timer
  async function handleStart() {
    const start = new Date();
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, startedAt: start.toISOString() }),
    });

    const data = await res.json();
    setEntryId(data.id);
    setStartTime(start.getTime());
    setIsRunning(true);

    // Save to localStorage
    localStorage.setItem("entryId", data.id);
    localStorage.setItem("startTime", String(start.getTime()));
  }

  // Stop Timer
  async function handleStop() {
    if (!entryId) return;

    const end = new Date();

    await fetch("/api/time-entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, endedAt: end.toISOString() }),
    });

    setIsRunning(false);
    setSeconds(0);
    setEntryId(null);
    setStartTime(null);

    // Remove stored values
    localStorage.removeItem("entryId");
    localStorage.removeItem("startTime");
  }

  const f = (n: number) => String(n).padStart(2, "0");
  const h = f(Math.floor(seconds / 3600));
  const m = f(Math.floor((seconds % 3600) / 60));
  const s = f(seconds % 60);

  return (
    <div className="flex items-center gap-3 mt-3 text-sm">
      <span className="font-mono">{h}:{m}:{s}</span>

      {!isRunning ? (
        <button
          className="bg-emerald-600 px-3 py-1 rounded text-white text-xs"
          onClick={handleStart}
        >
          Start
        </button>
      ) : (
        <button
          className="bg-orange-600 px-3 py-1 rounded text-white text-xs"
          onClick={handleStop}
        >
          Stop & Save
        </button>
      )}
    </div>
  );
}
