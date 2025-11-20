"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string) {
  // 1️⃣ Delete all related time entries first
  await db.timeEntry.deleteMany({
    where: { taskId: id },
  });

  // 2️⃣ Now delete the task
  await db.task.delete({
    where: { id },
  });

  revalidatePath("/tasks");
}
