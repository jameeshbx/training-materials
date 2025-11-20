import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// =============================
// GET ALL TASKS
// =============================
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
      include: { timeEntries: true },
    });

    return NextResponse.json({ data: tasks });
  } catch (error) {
    console.error("GET /api/tasks error", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// =============================
// CREATE A TASK
// =============================
export async function POST(req: NextRequest) {
  try {
    const { title, description, status = "pending", userId } = await req.json();

    if (!title || !userId) {
      return NextResponse.json(
        { error: "title and userId are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: { title, description, status, userId },
    });

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// =============================
// UPDATE TASK
// =============================
export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ data: updatedTask });
  } catch (error) {
    console.error("PUT /api/tasks error", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// =============================
// DELETE TASK (supports JSON body OR query param)
// =============================
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Delete time entries first OR enable cascade delete" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}


