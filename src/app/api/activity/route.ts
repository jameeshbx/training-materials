import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const teamId = searchParams.get("teamId");

        if (!teamId) {
            return NextResponse.json([], { status: 200 });
        }

        const activities = await prisma.activity.findMany({
            where: { teamId },
            orderBy: { createdAt: "desc" },
            take: 20, // latest 20 activities
        });

        return NextResponse.json(activities);
    } catch (err) {
        console.error("GET /api/activity error:", err);
        return NextResponse.json([], { status: 500 });
    }
}
