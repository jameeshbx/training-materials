import TaskTimer from "@/components/tasks/TaskTimer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import DeleteButton from "./DeleteButton";
import TimeEntryList from "@/components/tasks/TimeEntryList";

export default async function TaskPage() {
  // ✅ MUST BE INSIDE THE COMPONENT
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-red-500">Not authenticated</p>;
  }

  const userId = session.user.id;

  // ✅ NOW FILTER WORKS CORRECTLY
  const tasks = await db.task.findMany({
    where: { userId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <a
          href="/tasks/new"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          + New Task
        </a>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-slate-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{task.title}</h2>

            {task.description && (
              <p className="text-gray-300 mt-1">{task.description}</p>
            )}

            <div className="flex justify-between mt-3 text-sm text-gray-400">
              <span>Status: {task.status}</span>
            </div>
            {task.dueDate && (
  <p className="text-yellow-400 text-sm mt-1">
    Due Date: {new Date(task.dueDate).toLocaleDateString()}
  </p>
)}


            <TaskTimer taskId={task.id} />
            <TimeEntryList taskId={task.id} />

            <div className="flex gap-3 mt-4">
              <a
                href={`/tasks/${task.id}/edit`}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 text-sm rounded"
              >
                Edit
              </a>

              <DeleteButton id={task.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
