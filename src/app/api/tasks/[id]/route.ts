import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validation
const idSchema = z.coerce.number().int().positive(); 

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
});


export async function GET(req: NextRequest, { params }: any) {
  const parsedId = idSchema.safeParse(params.id);

  if (!parsedId.success) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({ where: { id: parsedId.data } });

  if (!task) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: task });
}


export async function PUT(req: NextRequest, { params }: any) {
  const parsedId = idSchema.safeParse(params.id);

  if (!parsedId.success) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid data", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const updated = await prisma.task.update({
    where: { id: parsedId.data },
    data: parsed.data,
  });

  return NextResponse.json({ success: true, data: updated });
}


export async function DELETE(req: NextRequest, { params }: any) {
  const parsedId = idSchema.safeParse(params.id);

  if (!parsedId.success) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
  }

  await prisma.task.delete({ where: { id: parsedId.data } });

  return NextResponse.json({ success: true, message: "Task deleted" });
}
