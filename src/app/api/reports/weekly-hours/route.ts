// // app/api/reports/weekly-hours/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// // import { sql } from "@prisma/client"; // optional, but use prisma.$queryRaw

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const from = url.searchParams.get("from") || "2025-01-01";
//   const to = url.searchParams.get("to") || new Date().toISOString().slice(0,10);

//   // Postgres: group by week (Monday-start) using date_trunc('week', start)
//   const rows = await prisma.$queryRaw`
//     SELECT
//       date_trunc('week', te."start")::date AS week_start,
//       te."userId" AS user_id,
//       SUM(EXTRACT(EPOCH FROM (te."end" - te."start")))/3600.0 AS hours
//     FROM "TimeEntry" te
//     WHERE te."start" >= ${from}::date
//       AND te."start" < (${to}::date + INTERVAL '1 day')
//     GROUP BY week_start, te."userId"
//     ORDER BY week_start, te."userId";
//   `;

//   // rows come as array: { week_start: '2025-11-24', user_id: 3, hours: 8.5 }
//   return NextResponse.json(rows);
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { startOfWeek, endOfWeek } from "date-fns";
export const revalidate = 60;
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    weekEnd.setHours(23, 59, 59, 999);

console.log("DB HIT: weekly-hours"); 

    const entries = await prisma.timeEntry.findMany({
      where: {
        startTime: { gte: weekStart },
        endTime: { lte: weekEnd }
      },
      include: { user: true }
    });

    const weeklyMap: Record<string, number> = {};
    for (const entry of entries) {
      if (!entry.endTime) continue;
      const durationHours = (entry.endTime.getTime() - entry.startTime.getTime()) / (1000 * 60 * 60);
      weeklyMap[entry.user.name] = (weeklyMap[entry.user.name] || 0) + durationHours;
    }

    const weeklyData = Object.entries(weeklyMap).map(([user, hours]) => ({
      user,
      hours: Math.max(0.01, Number(hours.toFixed(2)))
    }));

    // ✅ Add caching headers (CDN / edge cache)
    return NextResponse.json(weeklyData, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30"
      }
    });

  } catch (error: any) {
    console.error("❌ Weekly Report API Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
