// // app/api/reports/task-distribution/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // adjust import to your prisma client

// export async function GET() {
//   // Example: group by status and count tasks per status
//   const result = await prisma.task.groupBy({
//     by: ["status"],             // change to "assigneeId" or "projectId" as needed
//     _count: { _all: true }
//   });

//   // Normalize to { label, value } array
//   const payload = result.map(r => ({ label: r.status, value: r._count._all }));
//   return NextResponse.json(payload);
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const distribution = await prisma.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    // Transform the data to match the expected structure
    const formattedDistribution = distribution.map(item => ({
      status: item.status,
      _count: item._count.status
    }));

    return NextResponse.json(formattedDistribution);
  } catch (error: any) {
    console.error("❌ Error in distribution report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}