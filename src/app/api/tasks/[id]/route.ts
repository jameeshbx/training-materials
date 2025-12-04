import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { emitEvent } from "@/lib/socketServer.ts";
import { createAuditLog } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request-meta";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Validate numeric ID
const idSchema = z.coerce.number().int().positive();

// Schema for updating task
const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "progress", "completed"]).optional(),
  dueDate: z.string().optional(),
});

// ---------- GET SINGLE TASK ----------
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  // 👇 FIX: unwrap params Promise
  const { id } = await Promise.resolve(context.params);

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: parsedId.data },
  });

  if (!task) {
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: task });
}


/// ---------- UPDATE TASK ----------
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 👇 FIX: unwrap params Promise
    const { id } = await Promise.resolve(context.params);
    const taskId = Number(id);

    const body = await req.json();

    // validate body (optional but recommended)
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data" },
        { status: 400 }
      );
    }

    // before update
    const before = await prisma.task.findUnique({ where: { id: taskId } });
    if (!before) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    const { ip, userAgent } = getRequestMeta(req);

    await createAuditLog({
      userId: Number(session.user.id),
      action: "TASK_UPDATED",
      entity: "Task",
      entityId: updated.id,
      details: {
        beforeTitle: before.title,
        afterTitle: updated.title,
        status: updated.status,
        dueDate: updated.dueDate,
      },
      ip,
      userAgent,
    });

    emitEvent("taskUpdated", {
      id: updated.id,
      title: updated.title,
      status: updated.status,
      user: updated.user,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// ---------- DELETE TASK ----------
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  // 👇 FIX: unwrap params for Next.js 16 runtime
  const { id } = await Promise.resolve(context.params);
  const taskId = Number(id);

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { user: { select: { name: true } } }
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }

    await prisma.timeEntry.deleteMany({ where: { taskId } });
    await prisma.task.delete({ where: { id: taskId } });

    const { ip, userAgent } = getRequestMeta(req);

    await createAuditLog({
      userId: Number(session.user.id),
      action: "TASK_DELETED",
      entity: "Task",
      entityId: taskId,
      details: {
        title: task.title,
        status: task.status
      },
      ip,
      userAgent,
    });

    emitEvent("taskDeleted", {
      id: taskId,
      title: task.title,
      user: task.user
    });

    return NextResponse.json(
      { success: true, message: "Task deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
