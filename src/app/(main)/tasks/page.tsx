
"use client";

import { useEffect, useState } from "react";
import { deleteTask } from "@/lib/services/taskservice";
import TaskEditForm from "@/components/task/taskEditForm";
import Timer from "@/components/task/timer";
import Link from "next/link";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState<any>(null);

  // NEW STATES
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // ======================================
  // FETCH TASKS WITH SEARCH + PAGINATION
  // ======================================
  async function loadTasks() {
    setLoading(true);

    const res = await fetch(
      `/api/tasks?search=${search}&page=${page}&limit=4`
    );
    const data = await res.json();

    setTasks(data.tasks);
    setTotalPages(data.pagination.totalPages);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this task?");
    if (!ok) return;
    await deleteTask(id);
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, [search, page]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">

      {/* HEADER + ADD TASK */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Tasks</h1>

        <Link
          href="/tasks/addTask"
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm"
        >
          + Add Task
        </Link>
      </div>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => {
          setPage(1);  // Reset to page 1 when searching
          setSearch(e.target.value);
        }}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-gray-800 text-center py-4 text-sm">
          Loading tasks...
        </p>
      )}

      {/* TASK GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {!loading && tasks.length === 0 && (
          <p className="text-gray-500 text-center py-8 border rounded-lg col-span-full text-sm">
            No tasks found. Try another search or add a new task.
          </p>
        )}

        {!loading &&
          tasks.map((task: any) => {
            const latestEntry = task.timeEntries?.[0];

            return (
              <div
                key={task.id}
                className="border border-gray-200 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
              >
                {/* TITLE + DESCRIPTION */}
                <div className="flex-1 min-h-0 mb-3 overflow-hidden">
                  <h2 className="text-base font-semibold text-gray-800 truncate">
                    {task.title}
                  </h2>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {task.description || "No description"}
                  </p>

                  {task.dueDate && (
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      <strong>Due:</strong>{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {latestEntry && (
                  <div className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-xs mb-3 space-y-1">
                    {latestEntry.startAt && (
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">Start:</span>
                        <span>{new Date(latestEntry.startAt).toLocaleString()}</span>
                      </div>
                    )}

                    {latestEntry.endAt && (
                      <div className="flex justify-between text-gray-700">
                        <span className="font-semibold">End:</span>
                        <span>{new Date(latestEntry.endAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs mb-3">
                  <Timer
                    taskId={task.id}
                    onUpdate={(updatedEntry) => {
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id
                            ? {
                              ...t,
                              timeEntries: [
                                updatedEntry,
                                ...(t.timeEntries || []),
                              ],
                            }
                            : t
                        )
                      );
                    }}
                  />
                </div>


                {/* EDIT / DELETE */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline flex-1"
                  >
                    Edit
                  </button>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      {/* Sliding Modern Pagination */}
      {!loading && totalPages > 1 && tasks.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-6 select-none">

          {/* Prev Button */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-1.5 text-sm rounded-md border shadow transition 
        ${page === 1
                ? "opacity-40 cursor-not-allowed bg-white text-gray-500"
                : "bg-white text-gray-900 hover:bg-blue-100"
              }
      `}
          >
            Prev
          </button>

          {/* Sliding Window */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(
              Math.max(0, page - 3),
              Math.min(totalPages, page + 2)
            )
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-1.5 text-sm rounded-md border shadow transition 
            ${page === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-900 hover:bg-blue-100"
                  }
          `}
              >
                {p}
              </button>
            ))}

          {/* Next Button */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-1.5 text-sm rounded-md border shadow transition 
        ${page === totalPages
                ? "opacity-40 cursor-not-allowed bg-white text-gray-500"
                : "bg-white text-gray-900 hover:bg-blue-100"
              }
      `}
          >
            Next
          </button>

        </div>
      )}

      {/* EDIT MODAL */}
      {editingTask && (
        <TaskEditForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}

