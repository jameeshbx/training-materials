"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteTask(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  await db.task.delete({
    where: { id },
  });

  redirect("/tasks");
}
