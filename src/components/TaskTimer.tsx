"use client";
import { useEffect, useState } from "react";

interface TaskTimerProps {
  taskId: number;
  status: string;
}

export default function TaskTimer({ taskId, status }: TaskTimerProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [running, setRunning] = useState(0);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [savedEntry, setSavedEntry] = useState<any>(null);

  // Start/Stop Handler
  const handleToggle = async () => {
    if (!buttonStatus) {
      // Start timer
      setButtonStatus(true);
      if (!startTime) setStartTime(Date.now());
    } else {
      // Stop timer
      setButtonStatus(false);
      const end = Date.now();

      if (startTime) {
        await fetch("/api/time-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, startTime, endTime: end }),
        });

        fetchSavedTime();
      }
    }
  };

  // Count up live timer
  useEffect(() => {
    if (!buttonStatus) return;

    const interval = setInterval(() => {
      setRunning((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [buttonStatus]);

  // Fetch saved entry when task is completed or loaded
  useEffect(() => {
    if (status === "completed") {
      fetchSavedTime();
    }
  }, [status, taskId]);

  const fetchSavedTime = async () => {
    try {
      const res = await fetch(`/api/time-entries?taskId=${taskId}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setSavedEntry(data[data.length - 1]);
      }
    } catch (err) {
      console.log("❌ Error fetching entry:", err);
    }
  };

  // Live time counter formatting
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const formatDateTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  };

  return (
    <>
      {status === "pending" || status === "progress" ? (
        <div className="mt-3 ml-2 flex items-center gap-4">
          {/* Timer Live Display */}
          <div className="bg-gray-900 text-white px-4 py-2 rounded-sm shadow-md text-lg font-mono border ">
            {formatTime(running)}
          </div>

          {/* Start/Stop Button */}
          <button
            onClick={handleToggle}
            className={`px-5 py-2 rounded-sm text-white font-semibold shadow-md transition-all duration-300 ${
              buttonStatus
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-black"
            }`}
          >
            {buttonStatus ? "■ Stop" : " Start"}
          </button>
        </div>
      ) : (
        <div className=" text-green-600 px-2 py-2 rounded-lg shadow m-2">
          {savedEntry ? (
            <>
              <p><strong className="text-black">Start:</strong> {formatDateTime(savedEntry.startTime)}</p>
              <p><strong className="text-black">End:</strong> {formatDateTime(savedEntry.endTime)}</p>
            </>
          ) : (
            "Loading final time..."
          )}
        </div>
      )}
    </>
  );
}
