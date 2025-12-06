export const revalidate = 300; // Cache for 5 minutes

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

async function fetchDistributionData() {

  // ---- 1️⃣ Try Redis cache first ----
  const cached = await redis.get("task-distribution");
  if (cached) {
    console.log("🔥 Redis: distribution cache hit");
    return JSON.parse(cached);
  }

  console.log("📦 Redis miss → Querying DB");

  // ---- 2️⃣ DB Query ----
  const distribution = await prisma.task.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // ---- 3️⃣ Transform output ----
  const formatted = distribution.map(item => ({
    status: item.status,
    _count: item._count.status
  }));

  // ---- 4️⃣ Save to Redis (5 min) ----
  await redis.set("task-distribution", JSON.stringify(formatted), "EX", 300);

  return formatted;
}

export async function GET() {
  try {
    const data = await fetchDistributionData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Error in distribution report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
