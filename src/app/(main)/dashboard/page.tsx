
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <h1 className="text-xl">Not authenticated</h1>
      </div>
    );
  }

  const userId = session.user.id;

  const activeTimer = await prisma.timeEntry.findFirst({
    where: { userId, endAt: null },
    include: { task: true },
  });

  const todaysTasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
      dueDate: { not: null },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weekEntries = await prisma.timeEntry.findMany({
    where: {
      userId,
      startAt: { gte: startOfWeek },
      endAt: { not: null },
    },
  });

  const weeklySeconds = weekEntries.reduce(
    (sum, entry) => sum + (entry.duration || 0),
    0
  );
  const weeklyHours = (weeklySeconds / 3600).toFixed(1);

  return (
    <DashboardClient
      session={session}
      activeTimer={activeTimer}
      todaysTasks={todaysTasks}
      weeklyHours={weeklyHours}
    />
  );
}
