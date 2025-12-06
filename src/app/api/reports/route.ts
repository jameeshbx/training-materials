export const dynamic = "force-dynamic";



import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Cache this API response for 60 seconds
export const revalidate = 60;

export async function GET() {
  console.log("DB HIT: /api/reports");

  const reports = await db.timeEntry.groupBy({
    by: ["userId"],
    _sum: {
      hours: true,
    },
  });

  const taskDistribution = await db.timeEntry.groupBy({
  by: ["taskId", "userId"],
  _sum: { hours: true },
});


  return NextResponse.json({ reports, taskDistribution });
}
