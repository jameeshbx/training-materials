"use client";

import Link from "next/link";
import ActivityFeed from "@/components/ActivityFeed";
import { FaUsers, FaClipboardList, FaShieldAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

type DashboardClientProps = {
  todaysTasks: any[];
  role: string | undefined;
  initialActivities: any[];
  userName: string | null | undefined;
};

export default function DashboardClient({
  todaysTasks,
  role,
  initialActivities,
  userName,
}: DashboardClientProps) {

  const t = useTranslations("DashboardPage");

  return (
    <div className="p-6 text-white space-y-8">

      {/* WELCOME CARD */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-6 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold mb-2 tracking-wide">
        {t("welcomeTitle", { name: userName || "User" })}
        </h1>
        <p className="text-gray-200 text-lg">
          {t("welcomeSubtitle")}
        </p>
      </div>

      {/* ADMIN QUICK ACTION BUTTONS */}
      {role === "ADMIN" && (
        <div className="flex gap-4">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-5 py-3 
            rounded-xl text-white font-semibold shadow-md transition-all"
          >
            <FaUsers /> {t("manageUsers")}
          </Link>

          <Link
            href="/admin/audit-logs"
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-600 px-5 py-3 
            rounded-xl font-semibold shadow-md transition-all"
          >
            <FaShieldAlt /> {t("auditLogs")}
          </Link>
        </div>
      )}

      {/* LIVE ACTIVITY FEED */}
      <div>
        <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <FaClipboardList className="text-blue-400" />
          {t("recentActivity")}
        </h2>
        <div className="border border-slate-700 rounded-xl bg-slate-900 p-4 shadow-lg">
          <ActivityFeed initialActivities={initialActivities} />
        </div>
      </div>

      {/* TODAY'S TASKS */}
      <div>
        <h2 className="text-2xl font-bold mb-3">📌 {t("todaysTasks")}</h2>
        {todaysTasks.length === 0 ? (
          <p className="text-gray-400 bg-slate-800 p-4 rounded-lg text-center">
            {t("noTasks")}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {todaysTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800 p-5 rounded-xl shadow-md hover:bg-slate-700 transition-all"
              >
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.dueDate && (
                  <p className="text-gray-300 text-sm mt-1">
                    {t("due")}: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
