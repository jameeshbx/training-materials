"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  dueDate?: string | null;
  timeEntries?: TimeEntry[];
};

type TimeEntry = {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string | null;
};

export default function TasksPage() {
  const { data: session } = useSession();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [entries, setEntries] = useState<Record<string, TimeEntry[]>>({});

  // Create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createStatus, setCreateStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Timer state
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);

  // Live elapsed timer display
  const [elapsed, setElapsed] = useState("00:00:00");

  // Pagination + Search
  const [page, setPage] = useState(1);
  const limit = 5; // per your choice
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // debounce
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  const userId = (session?.user as any)?.id;

  // -----------------------------
  // FETCH TASKS + TIME ENTRIES (with pagination + search)
  // -----------------------------
  const fetchTasks = async (opts?: { page?: number; search?: string }) => {
    if (!userId) return;

    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set("userId", userId);
      q.set("page", String(opts?.page ?? page));
      q.set("limit", String(limit));
      if (opts?.search !== undefined) q.set("search", opts.search);
      else if (search) q.set("search", search);

      const res = await fetch(`/api/tasks?${q.toString()}`);
      if (!res.ok) {
        console.error("Failed to load tasks");
        setTasks([]);
        setTotalPages(1);
        setEntries({});
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTasks(data.data || []);
      setTotalPages(data.totalPages || 1);

      // fetch entries for tasks returned (but they are included in the response already)
      // normalize entries from included timeEntries
      const newEntries: Record<string, TimeEntry[]> = {};
      (data.data || []).forEach((t: Task) => {
        if (t.timeEntries) newEntries[t.id] = t.timeEntries;
      });
      setEntries(newEntries);

      // if any running entry belongs to this user, set as activeEntry
      const running = Object.values(newEntries)
        .flat()
        .find((e) => !e.endTime && e.userId === userId);
      if (running) setActiveEntry(running);
      else setActiveEntry(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // separate fetch for a single task's entries (used after stopping timer)
  const fetchTimeEntries = async (taskId: string) => {
    try {
      const res = await fetch(`/api/time?taskId=${encodeURIComponent(taskId)}`);
      if (!res.ok) return;
      const data = await res.json();
      setEntries((prev) => ({ ...prev, [taskId]: data.data || [] }));

      // update activeEntry if there is a running one for this user
      const running = (data.data || []).find(
        (e: TimeEntry) => !e.endTime && e.userId === userId
      );
      if (running) setActiveEntry(running);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // load initial tasks when userId present
    if (userId) {
      fetchTasks({ page: 1, search: "" });
      setPage(1);
    } else {
      setTasks([]);
      setEntries({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  

  // page change effect
  useEffect(() => {
    if (userId) fetchTasks({ page, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // debounced search effect
  useEffect(() => {
    if (!userId) return;
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(1);
      fetchTasks({ page: 1, search });
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, userId]);

  // -----------------------------
  // LIVE TIMER UPDATE
  // -----------------------------
  useEffect(() => {
    if (!activeEntry) {
      setElapsed("00:00:00");
      return;
    }

    const start = new Date(activeEntry.startTime).getTime();

    const update = () => {
      const diff = Date.now() - start;
      const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setElapsed(`${hrs}:${mins}:${secs}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeEntry]);

  // -----------------------------
  // CREATE NEW TASK
  // -----------------------------
  const createTask = async (e: any) => {
    e.preventDefault();
    if (!session?.user || !(session.user as any).id) {
      alert("You must be logged in to create a task.");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status: createStatus,
          userId,
          dueDate: dueDate || null,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setCreateStatus("pending");
        setDueDate("");
        // refetch first page
        setPage(1);
        fetchTasks({ page: 1, search });
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  // -----------------------------
  // DELETE TASK
  // -----------------------------
  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${encodeURIComponent(taskId)}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Delete failed");
        return;
      }

      // refresh current page (if last item on page removed, we may want to go to previous page)
      alert("Task deleted!");
      // better than full reload: refetch tasks and maybe adjust page
      // attempt to refetch; if the page becomes empty and page > 1, go back one page
      await fetchTasks({ page, search });
      // if no tasks on this page and page > 1 => go back a page
      setTimeout(async () => {
        if (tasks.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          fetchTasks({ page, search });
        }
      }, 200);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (taskToDelete) await deleteTask(taskToDelete);
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // -----------------------------
  // EDIT TASK
  // -----------------------------
  const openEditModal = (task: Task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  const updateTask = async () => {
    if (!editTask) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editTask.id,
          title: editTask.title,
          description: editTask.description,
          status: editTask.status,
          dueDate: editTask.dueDate ?? null,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        setEditTask(null);
        fetchTasks({ page, search });
      } else {
        const j = await res.json().catch(() => ({}));
        alert(j.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // -----------------------------
  // TIMER START
  // -----------------------------
  const startTimer = async (taskId: string) => {
    if (!session?.user) return alert("Please login");

    try {
      const userId = (session.user as any).id;
      const res = await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, userId }),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setActiveEntry(json.data);
        // append to entries for this task
        setEntries((prev) => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), json.data],
        }));
      } else {
        alert(json.error || "Failed to start timer");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start timer");
    }
  };

  // -----------------------------
  // TIMER STOP
  // -----------------------------
  const stopTimer = async () => {
    if (!activeEntry) return;

    try {
      const res = await fetch("/api/time", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: activeEntry.id }),
      });

      const json = await res.json();

      if (res.ok && json.data) {
        // refresh entries for the task
        await fetchTimeEntries(activeEntry.taskId);
        setActiveEntry(null);
        setElapsed("00:00:00");
      } else {
        alert(json.error || "Failed to stop timer");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to stop timer");
    }
  };

  // -----------------------------
  // TOTAL TIME FORMATTER
  // -----------------------------
  const formatDuration = (start: string, end: string | null) => {
    const s = new Date(start).getTime();
    const e = end ? new Date(end).getTime() : Date.now();
    const diff = e - s;

    const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div
      className="
  w-full 
  mx-auto 
  py-6 
  text-black 
  border 
  border-gray-300 
  rounded-xl 
  px-4 
  sm:px-8 
  lg:px-10
  max-w-5xl
"
    >
      <h1 className="text-3xl font-bold mb-5 text-center bg-gradient-to-r from-black to-grey bg-clip-text text-transparent ">Task Manager</h1>

      {/* CREATE TASK */}
      <div className="w-full px-4 sm:px-10 flex justify-center">
        <form
          onSubmit={createTask}
          className="bg-white shadow-md rounded p-5 mb-6 max-w-2xl mx-auto w-full"
        >
          <h2 className="text-xl font-semibold mb-3">Create Task</h2>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            required
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <input
            type="date"
            placeholder="Due date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <select
            value={createStatus}
            onChange={(e) => setCreateStatus(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button type="submit" className="bg-black text-white py-2 px-4 rounded w-full">
            Create Task
          </button>
        </form>
      </div>

      {/* SEARCH + LOADING */}
      <div className="flex items-center gap-3 mb-6 justify-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500 text-lg">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500 text-lg">No tasks yet. Start by creating one!</p>
          </div>
        ) : (
          tasks.map((task) => {
            const taskEntries = entries[task.id] || [];

            const total = taskEntries.reduce((sum, e) => {
              const s = new Date(e.startTime).getTime();
              const t = e.endTime ? new Date(e.endTime).getTime() : Date.now();
              return sum + (t - s);
            }, 0);

            const totalHrs = String(Math.floor(total / 3600000)).padStart(2, "0");
            const totalMin = String(Math.floor((total % 3600000) / 60000)).padStart(2, "0");
            const totalSec = String(Math.floor((total % 60000) / 1000)).padStart(2, "0");

            return (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                <p className="text-gray-600 font-semibold">{task.description}</p>
                {task.dueDate && (
                  <p className="text-xs bg-gray-500 text-gray-200 px-2 py-1 rounded-md font-medium">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-semibold text-gray-700">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                    ${
                      task.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : task.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                {/* BUTTONS */}
                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  {/* Edit */}
                  <button
                    onClick={() => openEditModal(task)}
                    className="text-black-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
                  >
                    Edit
                  </button>

                  {/* Timer */}
                  {activeEntry?.taskId === task.id ? (
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={stopTimer}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Stop
                      </button>

                      {/* LIVE TIMER */}
                      <div className="text-sm font-mono text-gray-700 mt-1">{elapsed}</div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTimer(task.id)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Start
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => {
                      setTaskToDelete(task.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-500 font-semibold hover:text-red-700 hover:underline transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {/* TOTAL TIME */}
                <p className="text-sm text-gray-700 mt-4 font-mono">
                  Total Time: {totalHrs}:{totalMin}:{totalSec}
                </p>

                {/* TIME ENTRIES LIST */}
                <div className="mt-3 space-y-1">
                  <p className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Time Entries:</p>

                  {taskEntries.length === 0 && <p className="text-xs text-gray-500">No time entries yet</p>}

                  {taskEntries.map((entry) => (
                    <p key={entry.id} className="text-xs text-gray-600 font-mono">
                      {new Date(entry.startTime).toLocaleString()} →{" "}
                      {entry.endTime ? new Date(entry.endTime).toLocaleString() : "Running..."}{" "}
                      ({formatDuration(entry.startTime, entry.endTime ?? null)})
                    </p>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-4">Created: {new Date(task.createdAt).toLocaleString()}</p>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION: Option A (Prev / Next) */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">Confirm Delete</h2>
            <p className="text-gray-700 mb-6 text-center">Are you sure you want to delete this task?</p>

            <div className="flex justify-between">
              <button onClick={cancelDelete} className="px-4 py-2 rounded bg-gray-300">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
          <div className="bg-white px-8 py-5 rounded-xl shadow-xl w-full max-w-[600px] border border-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Edit Task</h2>

            {/* Title */}
            <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={editTask.title}
              onChange={(e) => setEditTask((prev) => prev && { ...prev, title: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
            />

            {/* Description */}
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={editTask.description}
              onChange={(e) => setEditTask((prev) => prev && { ...prev, description: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
            />

            {/* Due Date */}
            <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
            <input
              type="date"
              value={editTask.dueDate ? new Date(editTask.dueDate).toISOString().slice(0, 10) : ""}
              onChange={(e) => setEditTask((prev) => prev && { ...prev, dueDate: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
            />

            {/* Status */}
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              value={editTask.status}
              onChange={(e) => setEditTask((prev) => prev && { ...prev, status: e.target.value })}
              className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                Cancel
              </button>

              <button onClick={updateTask} className="px-5 py-2 rounded-lg bg-black text-white hover:bg-blue-700 transition">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
