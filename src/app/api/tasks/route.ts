import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/validators/task";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: userId,
    },
    include: {
      assignee: true,
      team: true,
      timeEntries: {
        orderBy: { startAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tasks });
}


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const data = CreateTaskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...(data as any),
        dueDate: data.dueDate ? new Date(data.dueDate) : null, 
        assigneeId: userId,
      } as any,
      include: {
        assignee: true,
        team: true,
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const payload = UpdateTaskSchema.parse(body);
    const { id, ...updates } = payload;

    const existing = await prisma.task.findFirst({
      where: { id, assigneeId: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "You cannot update this task" },
        { status: 403 }
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(updates as any),
        dueDate: updates.dueDate ? new Date(updates.dueDate) : existing.dueDate,
      } as any,
      include: {
        assignee: true,
        team: true,
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json().catch(() => null);
      id = body?.id;
    }

    if (!id) {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    const existing = await prisma.task.findFirst({
      where: { id, assigneeId: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "You cannot delete this task" },
        { status: 403 }
      );
    }

    await prisma.timeEntry.deleteMany({ where: { taskId: id } });
    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Task deleted", task: existing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


