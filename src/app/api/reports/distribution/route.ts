export const dynamic = "force-dynamic";
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