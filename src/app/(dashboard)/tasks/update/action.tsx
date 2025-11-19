"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTask(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const status = formData.get("status")?.toString();

  if (!id) {
    throw new Error("Missing task ID");
  }

  await db.task.update({
    where: { id },
    data: {
      title: title || "",
      description: description || "",
      status: status || "pending",
    },
  });

  revalidatePath("/tasks");
  redirect("/tasks");
}
