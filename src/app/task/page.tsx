"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
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

  // Create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createStatus, setCreateStatus] = useState("pending");

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Timer state
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create new task
  const createTask = async (e: any) => {
    e.preventDefault();
    if (!session?.user || !(session.user as any).id) {
      alert("You must be logged in to create a task.");
      return;
    }

    const userId = (session.user as any).id;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        status: createStatus,
        userId,
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setCreateStatus("pending");
      fetchTasks();
    } else {
      alert("Failed to create task");
    }
  };

  // FIXED DELETE FUNCTION
const deleteTask = async (taskId: string) => {
  try {
    const res = await fetch(`/api/tasks?id=${taskId}`, {
      method: "DELETE",
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Delete failed");
      return;
    }

    alert("Task deleted!");
    window.location.reload();
  } catch (err) {
    alert("Something went wrong");
  }
};



  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // Edit modal open
  const openEditModal = (task: Task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  // Update task
  const updateTask = async () => {
    if (!editTask) return;

    const res = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTask),
    });

    if (res.ok) {
      setShowEditModal(false);
      setEditTask(null);
      fetchTasks();
    } else {
      alert("Update failed");
    }
  };

  // Timer start
  const startTimer = async (taskId: string) => {
    if (!session?.user) return alert("Please login");
    const userId = (session.user as any).id;

    const res = await fetch("/api/time", {
      method: "POST",
      body: JSON.stringify({ taskId, userId }),
    });

    const json = await res.json();
    if (json.success) setActiveEntry(json.data);
  };

  // Timer stop
  const stopTimer = async () => {
    if (!activeEntry) return;

    const res = await fetch("/api/time", {
      method: "PUT",
      body: JSON.stringify({ entryId: activeEntry.id }),
    });

    const json = await res.json();
    if (json.success) {
      setActiveEntry(null);
      fetchTasks();
    }
  };

  return (
<div className="max-w-2xl mx-auto py-10 text-black border border-gray-300 rounded-xl px-10">
      <h1 className="text-3xl font-bold mb-5 text-center">Task Manager</h1>

      {/* Create Task Form */}
      <form onSubmit={createTask} className="bg-white shadow-md rounded p-5 mb-6 ">
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

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-500 text-lg">No tasks yet. Start by creating one!</p>
          </div>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-1">{task.title}</h3>
            <p className="text-gray-600 mb-3 font-semibold">{task.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                ${
                  task.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4">
              {/* Edit */}
              <button
                onClick={() => openEditModal(task)}
                className="text-black-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
              >
                Edit
              </button>

              {/* Timer */}
              {activeEntry?.taskId === task.id ? (
                <button
                  onClick={stopTimer}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => startTimer(task.id)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-green-600"
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

            <p className="text-xs text-gray-400 mt-4">
              Created: {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
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
    <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
      Edit Task
    </h2>

    {/* Title */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
    <input
      type="text"
      value={editTask.title}
      onChange={(e) =>
        setEditTask((prev) => prev && { ...prev, title: e.target.value })
      }
      className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
    />

    {/* Description */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
    <textarea
      value={editTask.description}
      onChange={(e) =>
        setEditTask((prev) => prev && { ...prev, description: e.target.value })
      }
      className="w-full border border-gray-300 p-2.5 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
    />

    {/* Status */}
    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
    <select
      value={editTask.status}
      onChange={(e) =>
        setEditTask((prev) => prev && { ...prev, status: e.target.value })
      }
      className="w-full border border-gray-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none mb-5"
    >
      <option value="pending">Pending</option>
      <option value="in_progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>

    {/* Buttons */}
    <div className="flex justify-end gap-3">
      <button
        onClick={() => setShowEditModal(false)}
        className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
      >
        Cancel
      </button>

      <button
        onClick={updateTask}
        className="px-5 py-2 rounded-lg bg-black text-white hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  </div>
</div>


      )}
    </div>
  );
}
