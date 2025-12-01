// app/api/activities/recent/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json([], { status: 200 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, teamId: true }});
    if (!user) return NextResponse.json([], { status: 200 });

    // Return recent activities (limit 20). You can filter by team if needed.
    const activities = await prisma.activity.findMany({
      where: {
        // either global or user/team specific. For now show all
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(activities);
  } catch (err: any) {
    console.error("Activities error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
