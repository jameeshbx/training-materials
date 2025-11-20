import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

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
// POST  → START TIMER
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

    // Create a new time entry (endedAt = startedAt temporarily)
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
// PUT  → STOP TIMER
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

    // 1️⃣ Find the existing entry
    const entry = await db.timeEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Time entry not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Calculate hours
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

    // 3️⃣ Update entry with final timestamp + hours
    const updated = await db.timeEntry.update({
      where: { id: entryId },
      data: {
        endedAt: end,
        hours,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Timer Stop Error:", err);
    return NextResponse.json(
      { error: "Failed to stop timer" },
      { status: 500 }
    );
  }
}
