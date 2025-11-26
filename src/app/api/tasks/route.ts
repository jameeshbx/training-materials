import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// =============================
// GET ALL TASKS (with pagination + search + include timeEntries)
// Query params:
//  - userId (optional) -> filter tasks by user
//  - page (optional, default 1)
//  - limit (optional, default 5)
//  - search (optional) -> searches title and description (insensitive, contains)
// =============================
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || undefined;
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "5");
    const search = url.searchParams.get("search") || "";

    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;

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
        include: { timeEntries: true },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(count / take));

    return NextResponse.json({ data: tasks, totalPages, count });
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
    const { title, description, status = "pending", userId, dueDate } = await req.json();

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
    const { id, title, description, status, dueDate } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    return NextResponse.json({ data: updatedTask });
  } catch (error) {
    console.error("PUT /api/tasks error", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

// =============================
// DELETE TASK
// =============================
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.task.delete({ where: { id } });

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
