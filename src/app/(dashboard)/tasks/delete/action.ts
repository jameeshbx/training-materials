"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAction } from "@/lib/audit";

export async function deleteTask(id: string) {
  const session = await getServerSession(authOptions);

  // Authentication check
  if (!session || !session.user) {
    throw new Error("Not authenticated");
  }

  // RBAC: Only ADMIN can delete tasks
  // @ts-ignore
  if (session.user.role !== "ADMIN") {
    console.log("❌ DELETE BLOCKED: User is not admin");
    throw new Error("Not allowed");
  }

  // Check if task exists
  const task = await db.task.findUnique({ where: { id } });
  if (!task) {
    console.warn(`Task with id ${id} not found`);
    revalidatePath("/tasks");
    return;
  }

  // Delete related time entries
  await db.timeEntry.deleteMany({ where: { taskId: id } });

  // Delete task
  await db.task.delete({ where: { id } });

  // Audit Log entry
  // @ts-ignore
  await logAction({
    action: "TASK_DELETED",
    userId: session.user.id,
    targetType: "TASK",
    targetId: id,
  });

  revalidatePath("/tasks");
  return { message: "Task deleted" };
}
