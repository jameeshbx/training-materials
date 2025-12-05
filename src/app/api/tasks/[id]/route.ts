export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { emitEvent } from "@/lib/socketServer.ts";
import { createAuditLog } from "@/lib/audit";
import { getRequestMeta } from "@/lib/request-meta";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const idSchema = z.coerce.number().int().positive();

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "progress", "completed"]).optional(),
  dueDate: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

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
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const taskId = Number(id);
  const body = await req.json();

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
    include: { user: { select: { name: true } } },
  });

  const { ip, userAgent } = getRequestMeta(req);

  await createAuditLog({
    userId: Number(session.user.id),
    action: "TASK_UPDATED",
    entity: "Task",
    entityId: updated.id,
    details: { status: updated.status },
    ip,
    userAgent,
  });

  emitEvent("taskUpdated", updated);

  return NextResponse.json({ success: true, data: updated });
}

// ---------- DELETE TASK ----------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const taskId = Number(id);

  await prisma.task.delete({ where: { id: taskId } });

  emitEvent("taskDeleted", { id: taskId });

  return NextResponse.json({ success: true, message: "Task deleted" });
}
