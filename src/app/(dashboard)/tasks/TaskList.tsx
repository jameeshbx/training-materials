"use client";

import { useEffect, useState } from "react";
import TaskTimer from "@/components/tasks/TaskTimer";
import TimeEntryList from "@/components/tasks/TimeEntryList";
import DeleteButton from "./DeleteButton";

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);
    const res = await fetch(`/api/tasks?page=${page}&search=${search}`);
    const data = await res.json();
    setTasks(data.tasks);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, [page, search]);

  return (
    <>
      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="border border-white px-3 py-2 rounded text-white w-full"
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
          className="border px-3 py-1 rounded disabled:opacity-30"
        >
          Previous
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage(page + 1)}
          className="border px-3 py-1 rounded disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {loading && <p className="text-gray-400 mb-2">Loading tasks...</p>}

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
    </>
  );
}
