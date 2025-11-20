import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// DELETE → Delete a time entry and cleanup orphaned task
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "TimeEntry ID is required" },
        { status: 400 }
      );
    }

    // Find the time entry first
    const timeEntry = await prisma.timeEntry.findUnique({ where: { id } });

    if (!timeEntry) {
      return NextResponse.json(
        { error: "TimeEntry not found" },
        { status: 404 }
      );
    }

    // Delete the time entry
    await prisma.timeEntry.delete({ where: { id } });

    // If this was the last time entry for the task, delete the task too
    const remaining = await prisma.timeEntry.count({ where: { taskId: timeEntry.taskId } });

    if (remaining === 0) {
      // Delete the task (no related time entries left)
      await prisma.task.delete({ where: { id: timeEntry.taskId } });

      return NextResponse.json({ message: "TimeEntry deleted. Orphaned task deleted." });
    }

    return NextResponse.json({ message: "TimeEntry deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
