import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET ALL ACTIVITIES (sorted by most recent)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "50");

    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ data: activities });
  } catch (error) {
    console.error("GET /api/activity error", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

// CREATE ACTIVITY
export async function POST(req: NextRequest) {
  try {
    const { userId, userName, action } = await req.json();

    if (!userName || !action) {
      return NextResponse.json(
        { error: "userName and action are required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        userId: userId || null,
        userName,
        action,
      },
    });

    // Emit activity to all connected clients
    if (global.io) {
      global.io.emit("activityCreated", activity);
    }

    return NextResponse.json({ data: activity }, { status: 201 });
  } catch (error) {
    console.error("POST /api/activity error", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}