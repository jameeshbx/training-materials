import { db } from "@/lib/db";
import { updateTask } from "@/app/(dashboard)/tasks/update/action";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  // `params` is a Promise in this Next.js version — unwrap it first
  const { id } = await params;

  // 1️⃣ Load the task from DB using the URL id
  const task = await db.task.findUnique({
    where: { id },
  });

  // 2️⃣ If no task, show message
  if (!task) {
    return <p className="text-white p-8">Task not found</p>;
  }

  // 3️⃣ Show edit form
  return (
    <div className="p-8 text-white max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Task</h1>

      <form action={updateTask} className="space-y-4">
        {/* Hidden ID */}
        <input type="hidden" name="id" value={task.id} />

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            name="title"
            defaultValue={task.title}
            className="w-full bg-slate-700 p-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={task.description || ""}
            className="w-full bg-slate-700 p-2 rounded"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            defaultValue={task.status}
            className="w-full bg-slate-700 p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
