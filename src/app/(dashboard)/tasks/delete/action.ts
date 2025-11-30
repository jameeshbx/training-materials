"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string) {
  try {
    // Check if task exists first
    const task = await db.task.findUnique({
      where: { id },
    });

    if (!task) {
      console.warn(`Task with id ${id} not found, skipping delete`);
      revalidatePath("/tasks");
      return;
    }

    // 1️⃣ Delete all related time entries first
    await db.timeEntry.deleteMany({
      where: { taskId: id },
    });

    // 2️⃣ Now delete the task
    await db.task.delete({
      where: { id },
    });

    revalidatePath("/tasks");
  } catch (error) {
    console.error("Error deleting task:", error);
    // Revalidate path even on error to refresh the UI
    revalidatePath("/tasks");
    throw error;
  }
}
