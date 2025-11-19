import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/validators/task";

// -------------------------------------------------------
// GET → Fetch all tasks with relations
// -------------------------------------------------------
export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      assignee: true,
      team: true,
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
// DELETE → Delete task
// -------------------------------------------------------
// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Task ID is required" },
//         { status: 400 }
//       );
//     }

//     // 1. Delete all time entries related to this task
//     await prisma.timeEntry.deleteMany({
//       where: { taskId: id }
//     });

//     // 2. Now delete the task safely. Use deleteMany to avoid throwing
//     // if the task was already removed by another process.
//     const deleted = await prisma.task.deleteMany({
//       where: { id },
//     });

//     if (deleted.count === 0) {
//       return NextResponse.json(
//         { error: "Task not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ message: "Task deleted" });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 400 }
//     );
//   }
// }
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    // Fallback: allow id in JSON body for clients that send it in the body
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
    // Trim whitespace
    id = id.trim();
    // Remove surrounding quotes if the client sent the id with quotes (e.g. "id" or 'id')
    id = id.replace(/^['"]|['"]$/g, "");

    console.log("API: DELETE /api/tasks rawId=", rawId, "-> sanitized id=", id);

    // Ensure task exists first
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found", id }, { status: 404 });
    }

    // Delete related time entries and the task in a transaction to keep things consistent
    const [_, deleted] = await prisma.$transaction([
      prisma.timeEntry.deleteMany({ where: { taskId: id } }),
      prisma.task.deleteMany({ where: { id } }),
    ]);

    if (deleted.count === 0) {
      // If nothing deleted, return 404 and include id for debugging
      return NextResponse.json({ error: "Task not found", id }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted", task: existing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}