

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TaskList from "./TaskList";

export default async function TaskPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-red-500">Not authenticated</p>;
  }

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

      {/* List Tasks */}
      <TaskList />
    </div>
  );
}
