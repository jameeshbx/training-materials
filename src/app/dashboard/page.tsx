"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/usesocket";

// ✅ STATIC imports for translations (fixes build crash)
import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";

interface Activity {
  id: string;
  userId: string | null;
  userName: string;
  action: string;
  createdAt: string;
}

type Task = {
  id: string;
  title: string;
  dueDate?: string | null;
  userId: string;
};

export default function DashboardPage() {
  // ✅ language state (kept same)
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [messages, setMessages] = useState<any>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = (session?.user as any)?.id;
  const userName = (session?.user as any)?.name;

  // ✅ socket stays unchanged
  useSocket(userId, userName, (activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  });

  // ✅ FIXED translation loader (no dynamic import)
  useEffect(() => {
    const msgs = locale === "es" ? esMessages : enMessages;
    setMessages(msgs);
  }, [locale]);

  // ✅ auth redirect logic unchanged
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // ✅ activity fetch unchanged
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/activity")
        .then((res) => res.json())
        .then((json) => {
          setActivities(json.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  // ✅ tasks fetch unchanged
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/tasks?userId=${userId}`)
      .then((res) => res.json())
      .then((json) => {
        const allTasks: Task[] = json.data;

        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth();
        const dd = today.getDate();

        const todayOnly = allTasks.filter((t) => {
          if (!t.dueDate) return false;

          const d = new Date(t.dueDate);
          return (
            d.getFullYear() === yyyy &&
            d.getMonth() === mm &&
            d.getDate() === dd
          );
        });

        setTodayTasks(todayOnly);
      });
  }, [userId]);

  // ✅ translation helpers
  const t = (key: string) => messages?.dashboard?.[key] || key;
  const c = (key: string) => messages?.common?.[key] || key;

  if (status === "loading" || loading || !messages) {
    return (
      <div className="p-6 text-black" role="status" aria-live="polite">
        <div className="animate-pulse">{c("loading")}</div>
      </div>
    );
  }

  return (
    <main
      id="main-content"
      className="w-full min-h-screen p-6 bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50"
      aria-label="Dashboard main content"
    >
      {/* ✅ Language Switcher */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setLocale("en")}
          className={`px-3 py-1 rounded ${
            locale === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          EN
        </button>

        <button
          onClick={() => setLocale("es")}
          className={`px-3 py-1 rounded ${
            locale === "es" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          ES
        </button>
      </div>

      {/* Welcome Section */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("welcomeBack")},{" "}
          <span className="text-blue-600" aria-label={`User name: ${userName}`}>
            {userName}
          </span>{" "}
          <span role="img" aria-label="waving hand">
            👋
          </span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">{t("overview")}</p>
      </header>

      {/* Top Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-sm text-gray-500 mb-1">
            {t("totalActivities")}
          </h3>
          <p className="text-4xl font-bold text-blue-600">
            {activities.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-sm text-gray-500 mb-1">
            {t("todaysActivities")}
          </h3>
          <p className="text-4xl font-bold text-green-900">
            {
              activities.filter(
                (a) =>
                  new Date(a.createdAt).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-sm text-gray-500 mb-1">{t("activeUsers")}</h3>
          <p className="text-4xl font-bold text-purple-900">
            {new Set(activities.map((a) => a.userName)).size}
          </p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tasks Due Today */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold flex items-center gap-1 mb-1">
            📅 {t("tasksDueToday")}
          </h2>

          {todayTasks.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("noTasksToday")}</p>
          ) : (
            <ul className="space-y-3">
              {todayTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-4 rounded-xl bg-gray-50 border shadow"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {task.title}
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      {t("due")}:{" "}
                      {new Date(task.dueDate!).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">⚡ {t("liveFeed")}</h2>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500">{t("live")}</span>
            </div>
          </div>

          {activities.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              {t("noActivity")}
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border rounded-xl bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-600">
                          {activity.userName}
                        </span>
                        <span className="text-gray-700">
                          {activity.action}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
