"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAction } from "@/lib/audit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateTask(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const status = formData.get("status")?.toString();

  if (!id) {
    throw new Error("Missing task ID");
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const updated = await db.task.update({
    where: { id },
    data: {
      title: title || "",
      description: description || "",
      status: status || "pending",
    },
  });

  await logAction({
    action: "TASK_UPDATED",
    userId,
    targetType: "TASK",
    targetId: id,
    meta: { title, status },
  });

  revalidatePath("/tasks");
  redirect("/tasks");
}
