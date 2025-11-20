import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Start a timer
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

    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    return NextResponse.json({ error: "Failed to start timer" }, { status: 500 });
  }
}

// Stop a timer
export async function PUT(req: Request) {
  try {
    const { entryId } = await req.json();

    const entry = await prisma.timeEntry.update({
      where: { id: entryId },
      data: { endTime: new Date() },
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to stop timer" }, { status: 500 });
  }
}

// Get all time entries for a task
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  const entries = await prisma.timeEntry.findMany({
    where: { taskId: taskId || "" },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json({ data: entries });
}
