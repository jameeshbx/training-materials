import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ======================================================
   GET /api/tasks
   - If ?id= is passed → return single task
   - Else return tasks only for the logged-in user
====================================================== */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // ─────── Single Task ───────
  if (id) {
    const task = await db.task.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.userId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to view this task" },
        { status: 403 }
      );
    }

    return NextResponse.json(task);
  }

  // ─────── All Tasks of Logged-in User ───────
  const tasks = await db.task.findMany({
    where: { userId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

/* ======================================================
   POST /api/tasks
   Create a new task for logged-in user
====================================================== */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const task = await db.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "pending",
      userId: userId,          // 🔥 ALWAYS current logged-in user
      teamId: data.teamId ?? null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}

/* ======================================================
   PUT /api/tasks?id=...
   Update a task (only if it belongs to logged-in user)
====================================================== */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Task id is required" },
      { status: 400 }
    );
  }

  const existing = await db.task.findUnique({ where: { id } });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json(
      { error: "Not authorized to update this task" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const task = await db.task.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(task);
}

/* ======================================================
   DELETE /api/tasks?id=...
   Delete task ONLY if it belongs to logged-in user
====================================================== */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Task id is required" },
      { status: 400 }
    );
  }

  const existing = await db.task.findUnique({ where: { id } });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json(
      { error: "Not authorized to delete this task" },
      { status: 403 }
    );
  }

  await db.task.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Task deleted" });
}
