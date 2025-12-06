export const revalidate = 300;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { startOfWeek, endOfWeek } from "date-fns";
import { redis } from "@/lib/redis";

async function fetchWeeklyData() {

  // ----- 1. Check Redis cache -----
  const cached = await redis.get("weekly-report");
  if (cached) {
    console.log("🔥 Redis: weekly cached hit");
    return JSON.parse(cached);
  }

  console.log("📦 Redis miss → Querying DB");

  // ----- 2. Calculate week range -----
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  weekEnd.setHours(23, 59, 59, 999);

  // ----- 3. DB query -----
  const entries = await prisma.timeEntry.findMany({
    where: {
      startTime: { gte: weekStart },
      endTime: { lte: weekEnd }
    },
    include: { user: true }
  });

  // ----- 4. Process data -----
  const weeklyMap: Record<string, number> = {};

  for (const entry of entries) {
    if (!entry.endTime) continue;

    const durationMs = entry.endTime.getTime() - entry.startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);

    weeklyMap[entry.user.name] =
      (weeklyMap[entry.user.name] || 0) + durationHours;
  }

  const data = Object.entries(weeklyMap).map(([user, hours]) => ({
    user,
    hours: Math.max(0.01, Number(hours.toFixed(2)))
  }));

  // ----- 5. Save to Redis -----
  await redis.set("weekly-report", JSON.stringify(data), "EX", 300);

  return data;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await fetchWeeklyData();
  return NextResponse.json(data);
}
