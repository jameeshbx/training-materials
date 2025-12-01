"use client";

import { deleteTask } from "./delete/action";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <form
      action={async () => {
        const yes = confirm("Are you sure?");
        if (!yes) return;

        try {
          await deleteTask(id);
          router.refresh();
        } catch (error) {
          console.error("Failed to delete task:", error);
          alert("Failed to delete task. It may have already been deleted.");
        }
      }}
    >
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-sm rounded"
      >
        Delete
      </button>
    </form>
  );
}
