import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// --------------------------------------
// START TIMER (POST)
// --------------------------------------
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { taskId, notes } = body;

  const active = await prisma.timeEntry.findFirst({
    where: { userId: session.user.id, endAt: null },
  });

  if (active) {
    return NextResponse.json(
      { error: "Timer already running", entryId: active.id },
      { status: 400 }
    );
  }

  const entry = await prisma.timeEntry.create({
    data: {
      userId: session.user.id,
      taskId: taskId || null,
      notes: notes || null,
      startAt: new Date(),
    },
  });

  return NextResponse.json(entry, { status: 201 });
}

// --------------------------------------
// STOP TIMER (PATCH)
// --------------------------------------
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "TimeEntry ID is required" }, { status: 400 });
  }

  const entry = await prisma.timeEntry.findUnique({ where: { id } });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (entry.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (entry.endAt) {
    return NextResponse.json({ error: "Timer already stopped" }, { status: 400 });
  }

  const endAt = new Date();
  const duration = Math.floor((endAt.getTime() - entry.startAt.getTime()) / 1000);

  const updated = await prisma.timeEntry.update({
    where: { id },
    data: { endAt, duration },
  });

  return NextResponse.json(updated);
}

// --------------------------------------
// DELETE (OPTIONAL AUTH)
// --------------------------------------
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "TimeEntry ID is required" }, { status: 400 });
    }

    const timeEntry = await prisma.timeEntry.findUnique({ where: { id } });

    if (!timeEntry) {
      return NextResponse.json({ error: "TimeEntry not found" }, { status: 404 });
    }

    await prisma.timeEntry.delete({ where: { id } });

    const remaining = await prisma.timeEntry.count({
      where: { taskId: timeEntry.taskId },
    });

    if (remaining === 0) {
      await prisma.task.delete({ where: { id: timeEntry.taskId! } });
      return NextResponse.json({ message: "TimeEntry deleted. Task removed." });
    }

    return NextResponse.json({ message: "TimeEntry deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

