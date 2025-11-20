"use client";

import { deleteTask } from "./delete/action";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        const yes = confirm("Are you sure?");
        if (!yes) return;

        await deleteTask(id);
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
