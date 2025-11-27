import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  try {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });

    const entries = await prisma.timeEntry.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end,
        },
        endTime: { not: null },
      },
      include: { 
        user: true,
        task: true 
      },
    });

    const result: Record<string, number> = {};

    entries.forEach((entry) => {
      const diffHours =
        (new Date(entry.endTime!).getTime() -
          new Date(entry.startTime).getTime()) /
        (1000 * 60 * 60);

      const name = entry.user.name || "Unknown";

      result[name] = (result[name] || 0) + diffHours;
    });

    const formatted = Object.entries(result).map(([user, hours]) => ({
      user,
      hours: Number(hours.toFixed(2)),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("❌ Weekly report error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}