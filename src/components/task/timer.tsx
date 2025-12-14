
"use client";

import { useState, useEffect, useRef } from "react";

export default function Timer({
    taskId,
    onUpdate,
}: {
    taskId: string;
    onUpdate?: (updatedEntry: any) => void;
}) {
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function loadActiveTimer() {
            const res = await fetch("/api/time-entries");
            const data = await res.json();

            if (data.active) {
                const entry = data.active;

                if (entry.taskId === taskId) {
                    setActiveEntryId(entry.id);
                    setRunning(true);

                    const seconds = Math.floor(
                        (Date.now() - new Date(entry.startAt).getTime()) / 1000
                    );
                    setElapsed(seconds);
                }
            }
        }

        loadActiveTimer();

        const handler = () => {
            if (!document.hidden) loadActiveTimer();
        };

        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    }, [taskId]);

    // Timer ticking
    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => {
                setElapsed((prev) => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [running]);

    const format = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // START TIMER
    const startTimer = async () => {
        const res = await fetch("/api/time-entries", {
            method: "POST",
            body: JSON.stringify({ taskId }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }

        setActiveEntryId(data.id);
        setElapsed(0);
        setRunning(true);

        // update ONLY this task card
        onUpdate?.(data);
    };

    // STOP TIMER
    const stopTimer = async () => {
        if (!activeEntryId) return;

        const res = await fetch("/api/time-entries", {
            method: "PATCH",
            body: JSON.stringify({ id: activeEntryId }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }

        setRunning(false);
        setActiveEntryId(null);

        // update ONLY this task card
        onUpdate?.(data);
    };

    return (
        <div className="p-5 rounded-lg bg-gray-900 text-white shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-3">Task Timer</h2>

            <div className="text-4xl font-mono font-bold mb-6 text-center">
                {format(elapsed)}
            </div>

            {!running ? (
                <button
                    onClick={startTimer}
                    className="px-4 py-3 bg-green-600 text-white rounded-md w-full hover:bg-green-700 transition"
                >
                    Start Timer
                </button>
            ) : (
                <button
                    onClick={stopTimer}
                    className="px-4 py-3 bg-red-600 text-white rounded-md w-full hover:bg-red-700 transition"
                >
                    Stop Timer
                </button>
            )}
        </div>
    );
}
