import { db } from "@/lib/db";
import { deleteTask } from "@/app/(dashboard)/tasks/delete/action";

export default async function TaskPage() {
  // 1️⃣ Fetch tasks from the database
  const tasks = await db.task.findMany({
    include: { user: true }, // get user info
    orderBy: { createdAt: "desc" }, // newest first
  });

  // 2️⃣ Show tasks
  return (
    <div className="p-8 text-white">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        {/* NEW TASK BUTTON */}
        <a
          href="/tasks/new"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          + New Task
        </a>
      </div>

      {/* No tasks message */}
      {tasks.length === 0 && (
        <p className="text-gray-400">No tasks found.</p>
      )}

      {/* Task Cards */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
          >
            {/* Task Title */}
            <h2 className="text-xl font-semibold">{task.title}</h2>

            {/* Description */}
            {task.description && (
              <p className="text-gray-300 mt-1">{task.description}</p>
            )}

            {/* Status + User */}
            <div className="flex justify-between mt-3 text-sm text-gray-400">
              <span>Status: {task.status}</span>
              {/* <span>User: {task.user?.name ?? "Unknown"}</span> */}
            </div>

            {/* ACTION BUTTONS: EDIT + DELETE */}
            <div className="flex gap-3 mt-4">

              {/* EDIT BUTTON */}
               <a
  href={`/tasks/${task.id}/edit`}
  className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 text-sm rounded"
>
  Edit
</a>



              {/* DELETE BUTTON */}
              <form action={deleteTask}>
                <input type="hidden" name="id" value={task.id} />

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-sm rounded"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
