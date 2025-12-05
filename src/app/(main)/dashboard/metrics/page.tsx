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
        const interval = setInterval(fetchHealth, 10000); // auto refresh every 10s
        return () => clearInterval(interval);
    }, []);

    function formatUptime(seconds: number) {
        const s = Math.floor(seconds);
        const mins = Math.floor(s / 60);
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m ${s % 60}s`;
    }

    if (loading) {
        return <div className="p-6">Loading metrics...</div>;
    }

    if (!health) {
        return <div className="p-6 text-red-600">Failed to load health data.</div>;
    }

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">App Metrics Dashboard</h1>

            <div className="border rounded-lg p-4 shadow-md space-y-3">
                <div>
                    <span className="font-semibold">Status: </span>
                    <span
                        className={
                            health.status === "ok" ? "text-green-600" : "text-red-600"
                        }
                    >
                        {health.status === "ok" ? "Healthy" : "Unhealthy"}
                    </span>
                </div>

                <div>
                    <span className="font-semibold">Uptime: </span>
                    {formatUptime(health.uptime)}
                </div>

                <div>
                    <span className="font-semibold">Last Check: </span>
                    {new Date(health.timestamp).toLocaleString()}
                </div>

                <div>
                    <span className="font-semibold">Response Time: </span>
                    {health.responseTimeMs} ms
                </div>
            </div>
        </div>
    );
}
