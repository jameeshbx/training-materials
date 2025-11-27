import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { emitEvent } from "@/lib/socketServer.ts";

// Schema for validation
const idSchema = z.coerce.number().int().positive(); 

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "progress", "completed"]).optional(),
      dueDate: z.string().optional(), // 👈 Add this

});


// ---------- GET SINGLE TASK ----------
export async function GET(req: NextRequest, context: any) {
  const { id } = await context.params;  // 👈 FIX

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({ where: { id: parsedId.data } });

  if (!task) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: task });
}



// ---------- UPDATE TASK ----------
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const id = Number(params.id);

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
      include: {
        user: { select: { name: true } }, // 👈 helps UI show username without refetch
      }
    });

    // 🎯 SOCKET EVENT
    emitEvent("taskUpdated", updated);

    return NextResponse.json({ success: true, data: updated });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}




// ---------- DELETE TASK ----------
export async function DELETE(req: NextRequest, context: any) {
  const { id } = await context.params;

  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json(
      { success: false, error: "Invalid ID" },
      { status: 400 }
    );
  }

  const taskId = parsedId.data;

  try {
    // First delete related time entries
    await prisma.timeEntry.deleteMany({
      where: { taskId }
    });

    // Then delete task
    await prisma.task.delete({
      where: { id: taskId }
    });
emitEvent("taskDeleted", { id: taskId });

    return NextResponse.json({
      success: true,
      message: "Task and related time entries deleted"
    });

  } catch (error: any) {
    console.error("❌ Error deleting:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

