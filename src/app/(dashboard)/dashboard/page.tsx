import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return <p className="text-red-500 p-10">Not authenticated</p>;
  }

  // Fetch initial activities
  const activities = await db.activity.findMany({
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  // Serialize activities for client (convert Date to string)
  const initialActivities = activities.map((activity) => ({
    ...activity,
    timestamp: activity.timestamp.toISOString(),
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let todaysTasks: any[] = [];

  if (user.role === "ADMIN") {
    todaysTasks = await db.task.findMany({
      where: { dueDate: { gte: today, lt: tomorrow } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    todaysTasks = await db.task.findMany({
      where: { userId: user.id, dueDate: { gte: today, lt: tomorrow } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <DashboardClient
      todaysTasks={todaysTasks}
      role={user.role}
      initialActivities={initialActivities}
      userName={user.name}   // PASS NAME
    />
  );
}
