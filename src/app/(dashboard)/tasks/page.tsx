

import TaskTimer from "@/components/tasks/TaskTimer";

import { db } from "@/lib/db";
import DeleteButton from "./DeleteButton";

export default async function TaskPage() {
  const tasks = await db.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
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
               {/* Description */}
             {task.description && (
               <p className="text-gray-300 mt-1">{task.description}</p>
             )}

             {/* Status + User */}
             <div className="flex justify-between mt-3 text-sm text-gray-400">
               <span>Status: {task.status}</span>
               {/* <span>User: {task.user?.name ?? "Unknown"}</span> */}
             </div>
             <TaskTimer taskId={task.id} />


            <div className="flex gap-3 mt-4">
              <a
                href={`/tasks/${task.id}/edit`}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 text-sm rounded"
              >
                Edit
              </a>

              {/* DELETE BUTTON FIXED */}
              <DeleteButton id={task.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
