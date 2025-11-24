import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardClient from "./DashboardClient";
import { Task } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  const userId = session?.user?.id;
  // @ts-ignore
  const role = session?.user?.role;

  if (!userId) {
    return <p className="text-red-500 p-10">Not authenticated</p>;
  }

  // Prepare date range for "today"
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let todaysTasks: Task[] = [];

  if (role === "ADMIN") {
    // ADMIN sees ALL USERS' tasks due today
    todaysTasks = await db.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // USER sees only their tasks
    todaysTasks = await db.task.findMany({
      where: {
        userId,
        dueDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return <DashboardClient todaysTasks={todaysTasks} role={role} />;
}
