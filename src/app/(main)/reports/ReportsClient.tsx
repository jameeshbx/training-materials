
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
import { useTranslations } from "next-intl";

/* =======================
   🔧 Helper functions
======================= */

function formatHours(hours: number) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    if (h === 0 && m === 0) return "0m";
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;

    return `${h}h ${m}m`;
}

function toPercentage(value: number, total: number) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
}

export default function ReportsClient() {
    const t = useTranslations("common");

    const [data, setData] = useState({
        weeklyHoursPerMember: [] as any[],
        taskDistribution: [] as any[],
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
                setError(t("reportsError"));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [t]);

    if (loading)
        return (
            <div className="p-8 text-center text-gray-400">
                {t("loadingReports")}
            </div>
        );

    if (error)
        return <div className="p-8 text-center text-red-400">{error}</div>;

    /* =======================
       📊 Task distribution %
    ======================= */

    const totalTaskHours = data.taskDistribution.reduce(
        (sum, item) => sum + item.totalHours,
        0
    );

    const taskDistributionPercent = data.taskDistribution.map((item) => ({
        ...item,
        percent: toPercentage(item.totalHours, totalTaskHours),
    }));

    const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

    return (
        <div className="px-6 py-10 space-y-10 max-w-7xl mx-auto">
            {/* ✅ PAGE HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {t("reportsOverview")}
                </h1>
                <p className="text-indigo-100 mt-1">
                    {t("reportsSubtitle")}
                </p>
            </div>

            {/* ✅ RESPONSIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* =======================
                   WEEKLY HOURS CARD
                ======================= */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {t("weeklyHoursPerMember")}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {t("weeklyHoursDesc")}
                    </p>

                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <BarChart data={data.weeklyHoursPerMember}>
                                <XAxis dataKey="userName" />
                                <YAxis
                                    tickFormatter={(v) =>
                                        formatHours(Number(v))
                                    }
                                />
                                <Tooltip
                                    formatter={(value: number) =>
                                        formatHours(value)
                                    }
                                    labelFormatter={(label) =>
                                        `Member: ${label}`
                                    }
                                />
                                <Legend />
                                <Bar
                                    dataKey="totalHours"
                                    fill="#6366f1"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* =======================
                   TASK DISTRIBUTION CARD
                ======================= */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {t("taskDistribution")}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {t("taskDistributionDesc")}
                    </p>

                    <div className="w-full h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%">
                            <PieChart>
                                <Pie
                                    data={taskDistributionPercent}
                                    dataKey="percent"
                                    nameKey="taskName"
                                    outerRadius={120}
                                    innerRadius={50}
                                    label={false}
                                >
                                    {taskDistributionPercent.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="#ffffff"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    formatter={(value: number, _name, props: any) => [
                                        `${value}%`,
                                        props.payload.taskName,
                                    ]}
                                />

                                <Legend
                                    formatter={(value) =>
                                        value.length > 16 ? value.slice(0, 16) + "…" : value
                                    }
                                />
                            </PieChart>

                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
