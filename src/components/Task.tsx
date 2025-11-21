"use client";

import { useEffect, useState } from "react";
import { Tasks } from "@/types/user";
import TaskForm from "@/components/TaskForm";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import TaskTimer from "@/components/TaskTimer";
import toast from "react-hot-toast";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Tasks | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.data);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete Task
  const deleteTask = async (id: number) => {
    const confirmDelete = confirm("⚠️ Delete this task?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });

    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Task deleted 🗑️");
    } else toast.error("Failed to delete task");
  };

  // Update Status
  const updateStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      fetchTasks();
      toast.success(`Task → ${status.replace("_", " ")}`);
    } else toast.error("Failed to update status");
  };

  const filteredTasks = tasks.filter((t) =>
    (t.title + t.description).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColor = (status: string) => ({
    pending: "bg-yellow-100 text-yellow-700",
    progress: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  }[status] || "bg-gray-100 text-gray-600");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-gray-500">Track time & manage productivity</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-md shadow p-4 mb-6 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* Task Grid */}
        {loading ? (
          <p className="text-center text-gray-600 py-10">Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No tasks found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <TaskTimer taskId={task.id} status={task.status} />

                {/* Body */}
                <div className="p-6 space-y-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                      task.status || "pending"
                    )}`}
                  >
                    {task.status.replace("_", " ") || "Pending"}
                  </span>

                  <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                  <p className="text-gray-600 text-sm">{task.description || "No description"}</p>
                </div>

                {/* Controls */}
                <div className="px-6 pb-4 flex gap-2">

                  {task.status === "completed" ? (
                    <button disabled className="flex-1 bg-gray-400 text-white text-xs py-2 px-3 rounded-md cursor-not-allowed">
                      Completed ✔
                    </button>
                  ) : task.status === "progress" ? (
                    <button
                      onClick={() => updateStatus(task.id, "completed")}
                      className="flex-1 bg-purple-600 text-white text-xs py-2 px-3 rounded-md hover:bg-purple-700"
                    >
                      Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(task.id, "progress")}
                      className="flex-1 bg-green-600 text-white text-xs py-2 px-3 rounded-md hover:bg-green-700"
                    >
                      Start Task
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setShowForm(true);
                    }}
                    className="flex-1 border text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-1 bg-red-600 text-white text-xs py-2 px-3 rounded-md hover:bg-red-700"
                  >
                    <Trash2 size={14} /> Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <TaskForm
            task={editTask}
            close={() => {
              setShowForm(false);
              setEditTask(null);
            }}
            refresh={fetchTasks}
          />
        )}
      </div>
    </div>
  );
}
