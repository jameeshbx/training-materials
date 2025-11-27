// src/app/api/activity/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const activities = await db.activity.findMany({
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("❌ Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to load activities" }, { status: 500 });
  }
}
