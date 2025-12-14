
"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
    status: string;
    uptime: number;
    timestamp: string;
    responseTimeMs: number;
};

export default function MetricsDashboard() {
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchHealth() {
        try {
            const res = await fetch("/api/health");
            const data = await res.json();
            setHealth(data);
        } catch (err) {
            console.error("Error fetching health:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 10000);
        return () => clearInterval(interval);
    }, []);

    function formatUptime(seconds: number) {
        const s = Math.floor(seconds);
        const mins = Math.floor(s / 60);
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m ${s % 60}s`;
    }

    if (loading) {
        return <div className="p-6 text-gray-700">Loading metrics...</div>;
    }

    if (!health) {
        return <div className="p-6 text-red-600">Failed to load health data.</div>;
    }

    return (
        <div className="p-8 space-y-6">
            {/* KEEP ORIGINAL HEADING POSITION */}
            <h1 className="text-2xl font-bold text-black">
                App Metrics Dashboard
            </h1>

            {/* KEEP ORIGINAL CARD ALIGNMENT */}
            <div className="bg-white border border-white/60 rounded-xl p-6 shadow-lg space-y-4">
                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Status</span>
                    <span
                        className={`font-semibold ${health.status === "ok"
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >
                        {health.status === "ok" ? "Healthy" : "Unhealthy"}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Uptime</span>
                    <span className="text-gray-900">
                        {formatUptime(health.uptime)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Last Check</span>
                    <span className="text-gray-900">
                        {new Date(health.timestamp).toLocaleString()}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                        Response Time
                    </span>
                    <span className="text-gray-900">
                        {health.responseTimeMs} ms
                    </span>
                </div>
            </div>
        </div>
    );
}
