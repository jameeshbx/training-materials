import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ active: null });
  }

  const active = await prisma.timeEntry.findFirst({
    where: { userId: session.user.id, endAt: null },
    include: { task: true },
  });

  return NextResponse.json({ active });
}


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

