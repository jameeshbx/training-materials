"use client";

import { useEffect, useState } from "react";

export default function TaskTimer({ taskId }: { taskId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [entryId, setEntryId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Timer counter
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  // -----------------------
  // START TIMER
  // -----------------------
  async function handleStart() {
    const start = new Date();

    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId,
        startedAt: start.toISOString(),
      }),
    });

    const data = await res.json();

    setEntryId(data.id); // save the entryId
    setStartTime(start);
    setSeconds(0);
    setIsRunning(true);
  }

  // -----------------------
  // STOP TIMER
  // -----------------------
  async function handleStop() {
    if (!entryId) return;

    const end = new Date();

    await fetch("/api/time-entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entryId,
        endedAt: end.toISOString(),
      }),
    });

    setIsRunning(false);
    setSeconds(0);
    setEntryId(null);
    setStartTime(null);
  }

  // Format HH:MM:SS
  const f = (n: number) => String(n).padStart(2, "0");
  const h = f(Math.floor(seconds / 3600));
  const m = f(Math.floor((seconds % 3600) / 60));
  const s = f(seconds % 60);

  return (
    <div className="flex items-center gap-3 mt-3 text-sm">
      <span className="font-mono text-gray-300">
        {h}:{m}:{s}
      </span>

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
