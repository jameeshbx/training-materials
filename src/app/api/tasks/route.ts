
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/validators/task";
import { emitActivity } from "@/lib/emitActivity";
import { logAction } from "@/lib/auditLogger";


/* ============================================================
   🔹 GET — Fetch Tasks (Search + Pagination + Optimized)
   ============================================================ */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const skip = (page - 1) * limit;

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where: {
        assigneeId: userId,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
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
      skip,
      take: limit,
    }),

    prisma.task.count({
      where: {
        assigneeId: userId,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return NextResponse.json({
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/* ============================================================
   🔹 POST — Create New Task (with Activity Save + Live Emit)
   ============================================================ */
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
      },
      include: {
        assignee: true,
        team: true,
      },
    });
    // ⭐ Audit Log — Task Created
    await logAction({
      userId,
      action: "TASK_CREATED",
      entityType: "TASK",
      entityId: task.id,
      details: `Task "${task.title}" was created`,
    });

    /* ============================================================
       ⭐ Save Activity to Database (Persistent)
       ============================================================ */
    const saved = await prisma.activity.create({
      data: {
        teamId: "default-team",
        message: `Created a new task: "${task.title}"`,
        userName: session.user.name ?? "Unknown",
      },
    });

    /* ============================================================
       ⭐ Emit Real-Time Activity to Socket Server
       ============================================================ */
    await emitActivity("default-team", {
      message: saved.message,
      userName: saved.userName,
      createdAt: saved.createdAt.toISOString(),
    });

    return NextResponse.json({ task });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/* ============================================================
   🔹 PUT — Update Task
   ============================================================ */
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
      },
      include: {
        assignee: true,
        team: true,
      },
    });

    /* ⭐ Audit Log — Task Updated */
    await logAction({
      userId,
      action: "TASK_UPDATED",
      entityType: "TASK",
      entityId: task.id,
      details: `Task "${task.title}" was updated`,
    });


    return NextResponse.json({ task });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/* ============================================================
   🔹 DELETE — Delete Task
   ============================================================ */
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

    await logAction({
      userId,
      action: "TASK_DELETED",
      entityType: "TASK",
      entityId: existing.id,
      details: `Task "${existing.title}" was deleted`,
    });
    return NextResponse.json({
      message: "Task deleted",
      task: existing,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

