import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";

/**
 * GET /api/tasks
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const task = await db.task.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  }

  const tasks = await db.task.findMany({ include: { user: true } });
  return NextResponse.json(tasks);
}

/**
 * POST /api/tasks
 * Body → validated with Zod
 */
export async function POST(req: NextRequest) {
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
      userId: data.userId,
      teamId: data.teamId ?? null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}

/**
 * PUT /api/tasks?id=...
 */
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Task id is required" },
      { status: 400 }
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

  const data = parsed.data;

  const task = await db.task.update({
    where: { id },
    data,
  });

  return NextResponse.json(task);
}

/**
 * DELETE /api/tasks?id=...
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task id is required" }, { status: 400 });
  }

  await db.task.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Task deleted" });
}
