"use client";

import ActivityFeedWrapper from "@/components/ActivityFeedWrapper";
import { useTranslations } from "next-intl";

export default function DashboardClient({
    session,
    activeTimer,
    todaysTasks,
    weeklyHours,
}: any) {
    const t = useTranslations("common");

    return (
        <div className="px-6 py-10 text-white space-y-10 max-w-6xl mx-auto">
            {/* ✅ HEADER */}
            <div>
                <h1 className="text-3xl font-bold">{t("dashboardTitle")}</h1>
                <p className="text-gray-300">
                    {t("welcomeBack")}, {session.user?.name} 👋
                </p>
            </div>

            {/* ✅ CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ✅ ACTIVE TIMER */}
                <div className="bg-[#1b1c1f] border border-gray-700 p-5 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-2">
                        ⏱ {t("activeTimer")}
                    </h2>

                    {activeTimer ? (
                        <div>
                            <p className="text-sm text-gray-300">
                                {t("task")}:{" "}
                                <span className="font-medium text-white">
                                    {activeTimer.task?.title}
                                </span>
                            </p>
                            <p className="mt-2 text-base font-bold text-green-400">
                                {t("timerRunning")}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">{t("noActiveTimer")}</p>
                    )}
                </div>

                {/* ✅ TODAY'S TASKS */}
                <div className="bg-[#1b1c1f] border border-gray-700 p-5 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-3">
                        📅 {t("todaysTasks")}
                    </h2>

                    {todaysTasks.length === 0 ? (
                        <p className="text-gray-400 text-sm">{t("noTasks")}</p>
                    ) : (
                        <ul className="space-y-2">
                            {todaysTasks.map((task: any) => (
                                <li
                                    key={task.id}
                                    className="text-sm text-gray-300 truncate border-b border-gray-700 pb-1"
                                >
                                    {task.title}
                                    <div className="text-xs text-gray-400">
                                        {t("due")}:{" "}
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ✅ WEEKLY HOURS */}
                <div className="bg-[#1b1c1f] border border-gray-700 p-5 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-3">
                        ⏳ {t("weeklyHours")}
                    </h2>
                    <p className="text-3xl font-bold text-blue-400">
                        {weeklyHours}h
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                        {t("trackedThisWeek")}
                    </p>
                </div>
            </div>

            <div className="mt-10">
                <ActivityFeedWrapper teamId="default-team" />
            </div>
        </div>
    );
}
