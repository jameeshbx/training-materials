"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function ReportsClient() {
    const [data, setData] = useState({
        weeklyHoursPerMember: [],
        taskDistribution: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/reports");
                if (!res.ok) throw new Error("Failed to fetch");

                const json = await res.json();
                setData(json);
            } catch (err) {
                setError("Could not load reports");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="p-6">Loading…</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

    return (
        <div className="p-6 space-y-8">
            {/* PAGE TITLE */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                Reports Overview
            </h1>
            <p className="text-gray-500">Insights from team performance & tasks</p>

            {/* 2-column responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* WEEKLY HOURS CARD */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Weekly Hours Per Team Member
                    </h2>

                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <BarChart data={data.weeklyHoursPerMember}>
                                <XAxis dataKey="userName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="totalHours"
                                    fill="#4f46e5"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TASK DISTRIBUTION CARD */}
                <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Task Distribution
                    </h2>

                    <div className="w-full h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%">
                            <PieChart>
                                <Pie
                                    data={data.taskDistribution}
                                    dataKey="totalHours"
                                    nameKey="taskName"
                                    outerRadius={120}
                                    label
                                >
                                    {data.taskDistribution.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="#ffffff"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
