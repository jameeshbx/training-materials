import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request-meta";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper function to create activity
async function createActivity(userId: string | null, userName: string, action: string) {
  try {
    const activity = await prisma.activity.create({
      data: { userId, userName, action },
    });

    if (global.io) global.io.emit("activityCreated", activity);
  } catch (error) {
    console.error("Failed to create activity:", error);
  }
}

/* ============================================
   GET TASKS
=============================================== */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "5");
    const search = url.searchParams.get("search") || "";
    const userId = url.searchParams.get("userId") || undefined;

    const take = Math.max(1, limit);
    const skip = (page - 1) * take;

    const where: any = {};
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tasks, count] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          timeEntries: true,
        },
      }),
      prisma.task.count({ where }),
    ]);

    const mapped = tasks.map((task) => ({
      ...task,
      userName: task.user?.name || "Unknown",
    }));

    return NextResponse.json({
      data: mapped,
      totalPages: Math.ceil(count / take),
      count,
    });
  } catch (error) {
    console.error("GET /api/tasks error", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

/* ============================================
   CREATE TASK
=============================================== */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const {
      title,
      description,
      status = "pending",
      userId,            // real assigned user
      dueDate,
    } = await req.json();

    if (!title || !userId) {
      return NextResponse.json({ error: "title and userId are required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    const assignedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    const userName = assignedUser?.name || "Unknown User";
    const { ip, userAgent } = getRequestMeta(req);

    await createActivity(userId, userName, `created task "${title}"`);

    if (global.io) global.io.emit("taskCreated", { ...task, userName });

   await createAuditLog({
  actorId: session?.user?.id || undefined,
  action: "TASK_CREATED",
  resource: "Task",
  resourceId: task.id,
  details: { title, status, dueDate },
  ip: ip ?? undefined,
  userAgent: userAgent ?? undefined,
});

    return NextResponse.json({ data: { ...task, userName } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

/* ============================================
   UPDATE TASK
=============================================== */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { id, title, description, status, dueDate } = await req.json();

    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const before = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: { user: { select: { name: true } } },
    });

    const userName = updatedTask.user?.name || "Unknown User";

    await createActivity(updatedTask.userId, userName, `updated task "${updatedTask.title}"`);

    if (global.io) global.io.emit("taskUpdated", updatedTask);

    const { ip, userAgent } = getRequestMeta(req);

    await createAuditLog({
  actorId: session?.user?.id || undefined,
  action: "TASK_UPDATED",
  resource: "Task",
  resourceId: updatedTask.id,
  details: {
    before,
    after: updatedTask,
  },
  ip: ip ?? undefined,
  userAgent: userAgent ?? undefined,
});

    return NextResponse.json({ data: updatedTask });
  } catch (error) {
    console.error("PUT /api/tasks error", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

/* ============================================
   DELETE TASK
=============================================== */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });

    await prisma.task.delete({ where: { id } });

    const userName = task?.user?.name || "Unknown";

    await createActivity(task?.userId || null, userName, `deleted task "${task?.title}"`);

    if (global.io) global.io.emit("taskDeleted", { id });

    const { ip, userAgent } = getRequestMeta(req);

   await createAuditLog({
  actorId: session?.user?.id || undefined,
  action: "TASK_DELETED",
  resource: "Task",
  resourceId: id,
  details: { title: task?.title, status: task?.status },
  ip: ip ?? undefined,
  userAgent: userAgent ?? undefined,
});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/tasks error", error);

    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Delete time entries first OR enable cascade delete" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
