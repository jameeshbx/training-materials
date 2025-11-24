"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  dueDate?: string | null;
  userId: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

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

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard - Welcome {session?.user?.name}
      </h1>

      <div className="bg-white shadow p-5 rounded-xl border max-w-xl">
        <h2 className="text-xl font-bold mb-3">📅 Today's Due Tasks</h2>

        {todayTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks due today 🎉</p>
        ) : (
          <ul className="space-y-2">
            {todayTasks.map((task) => (
              <li
                key={task.id}
                className="p-3 border rounded-lg bg-gray-50 font-medium"
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
