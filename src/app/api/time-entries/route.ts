import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ------------------------
// ZOD VALIDATIONS
// ------------------------

const StartSchema = z.object({
  taskId: z.string(),
  startedAt: z.string(),
});

const StopSchema = z.object({
  entryId: z.string(),
  endedAt: z.string(),
});

// ------------------------
// 🔹 GET → Fetch all entries for one task
// ------------------------

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    return NextResponse.json(
      { error: "taskId is required" },
      { status: 400 }
    );
  }

  try {
    const entries = await db.timeEntry.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 }
    );
  }
}

// ------------------------
// 🔹 POST → START TIMER
// ------------------------

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = StartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid start timer payload" },
        { status: 400 }
      );
    }

    const { taskId, startedAt } = parsed.data;

    const entry = await db.timeEntry.create({
      data: {
        taskId,
        startedAt: new Date(startedAt),
        endedAt: new Date(startedAt),
        hours: 0,
      },
    });

    return NextResponse.json(entry, { status: 201 });

  } catch (err) {
    console.error("Timer Start Error:", err);
    return NextResponse.json(
      { error: "Failed to start timer" },
      { status: 500 }
    );
  }
}

// ------------------------
// 🔹 PUT → STOP TIMER
// ------------------------

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = StopSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid stop timer payload" },
        { status: 400 }
      );
    }

    const { entryId, endedAt } = parsed.data;

    const entry = await db.timeEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Time entry not found" },
        { status: 404 }
      );
    }

    const start = new Date(entry.startedAt);
    const end = new Date(endedAt);

    const diffMs = end.getTime() - start.getTime();
    const hours = diffMs / (1000 * 60 * 60);

    if (hours <= 0) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    const updated = await db.timeEntry.update({
      where: { id: entryId },
      data: {
        endedAt: end,
        hours,
      },
      include: {
        task: {
          include: {
            user: {
              select: { id: true, name: true, teamId: true },
            },
          },
        },
      },
    });

    // ⬅️ EMIT SOCKET EVENT for activity feed when time is logged
    try {
      if (updated.hours > 0) {
        console.log("🚀 Attempting to emit activity for time logging...");
        const { emitActivity } = await import("@/lib/socket");
        const activityData = {
          type: "timeLogged" as const,
          userId: updated.task.user.id,
          userName: updated.task.user.name,
          teamId: updated.task.user.teamId ?? updated.task.teamId ?? null,
          taskId: updated.task.id,
          taskTitle: updated.task.title,
          hours: updated.hours,
        };
        console.log("📤 Activity data:", activityData);
        await emitActivity(activityData);
        console.log("✅ Activity emission completed");
      }
    } catch (error) {
      console.error("❌ Failed to emit activity:", error);
      // Don't fail the request if socket emission fails
    }

    return NextResponse.json(updated);

  } catch (err) {
    console.error("Timer Stop Error:", err);
    return NextResponse.json(
      { error: "Failed to stop timer" },
      { status: 500 }
    );
  }
}
