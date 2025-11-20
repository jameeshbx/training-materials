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

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // NEW: create-task status state
  const [createStatus, setCreateStatus] = useState("pending");

  // DELETE modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // EDIT modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data.data || []);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
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
        status: createStatus, // NEW: include status
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

  // DELETE task
  const deleteTask = async (id: string) => {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert("Delete failed");
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

  // OPEN edit modal
  const openEditModal = (task: Task) => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };

  // UPDATE task
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

  return (
    <div className="max-w-2xl mx-auto py-10 text-black">
      <h1 className="text-3xl font-bold mb-5 text-center">Task Manager</h1>

      {/* Create Task Form */}
      <form
        onSubmit={createTask}
        className="bg-white shadow-md rounded p-5 mb-6"
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

        {/* NEW: STATUS DROPDOWN */}
        <select
          value={createStatus}
          onChange={(e) => setCreateStatus(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded w-full"
        >
          Create Task
        </button>
      </form>

      {/* Task List */}
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
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-1">
        {task.title}
      </h3>

      {/* Description */}
<p className="text-gray-600 mb-3 font-semibold">{task.description}</p>

      {/* Status */}
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

      {/* Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => openEditModal(task)}
          className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
        >
          Edit
        </button>

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

      {/* Timestamp */}
      <p className="text-xs text-gray-400 mt-4">
        Created: {new Date(task.createdAt).toLocaleString()}
      </p>
    </div>
  ))}
</div>



      {/* DELETE Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to delete this task?
            </p>

            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT Task Modal */}
      {showEditModal && editTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Edit Task
            </h2>

            <input
              type="text"
              value={editTask.title}
              onChange={(e) =>
                setEditTask((prev) => prev && { ...prev, title: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              value={editTask.description}
              onChange={(e) =>
                setEditTask((prev) => prev && { ...prev, description: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />

            <select
              value={editTask.status}
              onChange={(e) =>
                setEditTask((prev) => prev && { ...prev, status: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={updateTask}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
