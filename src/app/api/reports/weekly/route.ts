export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET(req: Request) {
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Week range (Monday → Sunday)
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    weekEnd.setHours(23, 59, 59, 999);

    console.log("📅 Week Range:", weekStart, "→", weekEnd);

    // Fetch all entries within this week
    const entries = await prisma.timeEntry.findMany({
      where: {
        startTime: { gte: weekStart },
        endTime: { lte: weekEnd }
      },
      include: { user: true }
    });

    console.log("⏱ Entry Count:", entries.length);

    const weeklyMap: Record<string, number> = {};

    for (const entry of entries) {
      if (!entry.endTime) continue;

      const durationMs = entry.endTime.getTime() - entry.startTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      weeklyMap[entry.user.name] =
        (weeklyMap[entry.user.name] || 0) + durationHours;
    }

    // Ensure UI never gets `0`, so small time shows
    const weeklyData = Object.entries(weeklyMap).map(([user, hours]) => ({
      user,
      hours: Math.max(0.01, Number(hours.toFixed(2))) // Minimum 0.01 hr
    }));

    console.log("📊 Weekly Result:", weeklyData);

    return NextResponse.json(weeklyData);

  } catch (error: any) {
    console.error("❌ Weekly Report API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
