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
    return NextResponse.json({ error: "taskId is required" }, { status: 400 });
  }

  try {
    const entries = await db.timeEntry.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (err) {
    console.error("API FAIL:", err);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}


// ------------------------
// 🔹 POST → START TIMER
// ------------------------

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = StartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { taskId, startedAt } = parsed.data;

    const entry = await db.timeEntry.create({
      data: {
        taskId,
        userId: session.user.id,
        startedAt: new Date(startedAt),
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error("Timer Start Error:", err);
    return NextResponse.json({ error: "Failed to start timer" }, { status: 500 });
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

    // Update the time entry (without include to avoid inconsistent inferred types),
    // then re-fetch it with the related task and user for emitting activity and response.
    const updated = await db.timeEntry.update({
      where: { id: entryId },
      data: {
        endedAt: end,
        hours,
      },
    });

    const updatedWithTask = await db.timeEntry.findUnique({
      where: { id: entryId },
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
      if (updated.hours != null && updated.hours > 0 && updatedWithTask && updatedWithTask.task) {
        console.log("🚀 Attempting to emit activity for time logging...");
        const { emitActivity } = await import("@/lib/socket");
        const activityData = {
          type: "timeLogged" as const,
          userId: updatedWithTask.task.user.id,
          userName: updatedWithTask.task.user.name,
          teamId:
            updatedWithTask.task.user.teamId ??
            updatedWithTask.task.teamId ??
            null,
          taskId: updatedWithTask.task.id,
          taskTitle: updatedWithTask.task.title,
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

    return NextResponse.json(updatedWithTask ?? updated);

  } catch (err) {
    console.error("Timer Stop Error:", err);
    return NextResponse.json(
      { error: "Failed to stop timer" },
      { status: 500 }
    );
  }
}
