
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
        <div className="px-6 py-10 text-gray-900 space-y-10 max-w-7xl mx-auto">
            {/* ✅ HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {t("dashboardTitle")}
                </h1>
                <p className="text-gray-700 mt-1">
                    {t("welcomeBack")}, {session.user?.name} 👋
                </p>
            </div>

            {/* ✅ PERFECTLY CENTERED RESPONSIVE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">

                {/* ✅ ACTIVE TIMER */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xl h-full min-h-[150px]">
                    <h2 className="text-lg font-semibold mb-2 text-gray-900">
                        ⏱ {t("activeTimer")}
                    </h2>

                    {activeTimer ? (
                        <div>
                            <p className="text-sm text-gray-700">
                                {t("task")}:{" "}
                                <span className="font-medium text-gray-900">
                                    {activeTimer.task?.title}
                                </span>
                            </p>
                            <p className="mt-2 text-base font-bold text-green-600">
                                {t("timerRunning")}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">
                            {t("noActiveTimer")}
                        </p>
                    )}
                </div>

                {/* ✅ TODAY'S TASKS */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xl h-full min-h-[150px]">
                    <h2 className="text-lg font-semibold mb-3 text-gray-900">
                        📅 {t("todaysTasks")}
                    </h2>

                    {todaysTasks.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                            {t("noTasks")}
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {todaysTasks.map((task: any) => (
                                <li
                                    key={task.id}
                                    className="text-sm text-gray-700 truncate border-b border-gray-200 pb-1"
                                >
                                    {task.title}
                                    <div className="text-xs text-gray-500">
                                        {t("due")}:{" "}
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ✅ WEEKLY HOURS */}
                <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-xl h-full min-h-[150px]">
                    <h2 className="text-lg font-semibold mb-3 text-gray-900">
                        ⏳ {t("weeklyHours")}
                    </h2>
                    <p className="text-3xl font-bold text-blue-600">
                        {weeklyHours}h
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                        {t("trackedThisWeek")}
                    </p>
                </div>

            </div>

            {/* ✅ TEAM ACTIVITY */}
            <div className="mt-10 bg-white border border-gray-200 p-5 rounded-xl shadow-xl">
                <ActivityFeedWrapper teamId="default-team" />
            </div>
        </div>
    );

}
