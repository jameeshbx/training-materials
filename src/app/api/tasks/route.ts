import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations/task";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ======================================================
   GET /api/tasks
====================================================== */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const pageParam = searchParams.get("page") ?? "1";
  const search = searchParams.get("search") ?? "";

  if (id) {
    const task = await db.task.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
    if (task.userId !== userId)
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    return NextResponse.json(task);
  }

  const page = Math.max(1, Number(pageParam));
  const PAGE_SIZE = 10;

  const where: any = {
    userId,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [tasks, totalCount] = await Promise.all([
    db.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    }),
    db.task.count({ where }),
  ]);

  return NextResponse.json({ tasks, totalPages: Math.ceil(totalCount / PAGE_SIZE) });
}

/* ======================================================
   POST /api/tasks - Create Task
====================================================== */
/* ======================================================
   POST /api/tasks - Create Task + Create Activity + Emit Event
====================================================== */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    console.log("📥 POST /api/tasks - Request body:", body);

    const { userId: _, ...bodyWithoutUserId } = body;
    const parsed = createTaskSchema.safeParse(bodyWithoutUserId);

    if (!parsed.success) {
      console.error("❌ Validation error:", parsed.error.flatten());
      return NextResponse.json(
        { error: "Invalid data", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true, teamId: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? "pending",
        userId,
        teamId: data.teamId ?? user.teamId ?? null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    console.log("✅ Task created:", task.id);

    // --- Create Activity in DB ---
    const activity = await db.activity.create({
      data: {
        type: "taskCreated",
        userId,
        userName: user.name,
        teamId: user.teamId,
        taskId: task.id,
        taskTitle: task.title,
      },
    });

    console.log("📝 Activity saved in DB:", activity);

    // --- Emit Socket Event Live ---
    try {
      const { emitActivity } = await import("@/lib/socket");
      await emitActivity({
        type: "taskCreated",
        userId,
        userName: user.name,
        teamId: user.teamId ?? null,
        taskId: task.id,
        taskTitle: task.title,
      });
      console.log("📢 Activity emitted via WebSocket");
    } catch (err) {
      console.error("⚠️ Socket emit failed:", err);
    }

    return NextResponse.json(task, { status: 201 });

  } catch (err: any) {
    console.error("❌ Error in POST /api/tasks:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


/* ======================================================
   PUT /api/tasks
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

  if (!id) return NextResponse.json({ error: "Task id is required" }, { status: 400 });

  const body = await req.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const updated = await db.task.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

/* ======================================================
   DELETE /api/tasks
====================================================== */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Task id is required" }, { status: 400 });

  await db.task.delete({ where: { id } });

  return NextResponse.json({ message: "Task deleted" });
}
