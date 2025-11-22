
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/validators/task";

// -------------------------------------------------------
// GET → Fetch all tasks with relations + latest time entry
// -------------------------------------------------------
export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      assignee: true,
      team: true,

      // ⭐ ADDED: Include only the latest time entry (for start/end time in UI)
      timeEntries: {
        orderBy: { startAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tasks });
}

// -------------------------------------------------------
// POST → Create task
// -------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = CreateTaskSchema.parse(body);

    const task = await prisma.task.create({
      data,
      include: {
        assignee: true,
        team: true,
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// -------------------------------------------------------
// PUT → Update task
// -------------------------------------------------------
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const payload = UpdateTaskSchema.parse(body);

    const { id, ...updates } = payload;

    const task = await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        assignee: true,
        team: true,
      },
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// -------------------------------------------------------
// DELETE → Delete task + related time entries
// -------------------------------------------------------
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    // Fallback: allow id from body
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch (e) {
        // ignore invalid JSON
      }
    }

    if (!id || typeof id !== "string" || id.trim() === "") {
      return NextResponse.json({ error: "Task id is required" }, { status: 400 });
    }

    const rawId = id;
    id = id.trim().replace(/^['"]|['"]$/g, "");

    console.log("API: DELETE /api/tasks rawId=", rawId, "-> sanitized id=", id);

    // Ensure task exists
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found", id }, { status: 404 });
    }

    // Delete related entries + task
    const [_, deleted] = await prisma.$transaction([
      prisma.timeEntry.deleteMany({ where: { taskId: id } }),
      prisma.task.deleteMany({ where: { id } }),
    ]);

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Task not found", id }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted", task: existing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
