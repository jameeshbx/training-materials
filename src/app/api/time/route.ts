import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =======================
// START TIMER
// =======================
export async function POST(req: Request) {
  try {
    const { taskId, userId } = await req.json();

    const entry = await prisma.timeEntry.create({
      data: {
        taskId,
        userId,
        startTime: new Date(),
      },
    });

    // Emit real-time event
    if (global.io) {
const user = await prisma.user.findUnique({
  where: { id: entry.userId },
  select: { name: true },
});

global.io.emit("timerStarted", {
  ...entry,
  userName: user?.name,
});
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to start timer" },
      { status: 500 }
    );
  }
}

// =======================
// STOP TIMER
// =======================
export async function PUT(req: Request) {
  try {
    const { entryId } = await req.json();

    const entry = await prisma.timeEntry.update({
      where: { id: entryId },
      data: { endTime: new Date() },
    });

    // Emit real-time event
    if (global.io) {
const user = await prisma.user.findUnique({
  where: { id: entry.userId },
  select: { name: true },
});

global.io.emit("timerStopped", {
  ...entry,
  userName: user?.name,
});
    }

    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to stop timer" },
      { status: 500 }
    );
  }
}

// =======================
// GET ALL TIME ENTRIES FOR A TASK
// =======================
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  const entries = await prisma.timeEntry.findMany({
    where: { taskId: taskId || "" },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json({ data: entries });
}
