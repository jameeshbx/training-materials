"use client";

import { useEffect, useState } from "react";
import { Tasks } from "@/types/user";
import TaskForm from "@/components/TaskForm";
import { Plus, Edit, Trash2, Search, Clock, Calendar, Target, X } from "lucide-react";
import TaskTimer from "@/components/TaskTimer";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { timeAgo } from "@/lib/timeAgo";

import socket from "@/lib/socket";


export default function TasksPage() {
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Tasks | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; task: Tasks | null }>({
    show: false,
    task: null,
  });

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?date=${selectedDate}&search=${searchTerm}&page=${page}&limit=4`);
      const data = await res.json();
      setTasks(data.data);
            setTotalPages(data?.pagination?.totalPages || 1);

    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate,searchTerm, page]);

useEffect(() => {
  if (!socket.connected) socket.connect();

  const saveNotification = async (message: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error("❌ Failed to save notification", err);
    }
  };

  // 🔹 New Task
  const onCreated = (task: Tasks) => {
    setTasks(prev => [task, ...prev]);

    const userName = task?.user?.name ?? "Someone";
    const msg = `🔥 ${userName} added a new task: ${task.title}`;

    toast.success(msg);
    saveNotification(msg);
  };

  // 🔹 Updated Task
  const onUpdated = (updatedTask: Tasks) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    const userName = updatedTask?.user?.name ?? "Someone";
    const msg = `♻️ ${userName} updated task: ${updatedTask.title}`;

    toast.success(msg);
    saveNotification(msg);
  };

  // 🔹 Deleted Task
  const onDeleted = ({ id, title, user }: any) => {
    setTasks(prev => prev.filter(task => task.id !== id));

    const userName = user?.name ?? "Someone";
    const msg = `🗑️ ${userName} deleted task${title ? `: ${title}` : ""}`;

    toast.success(msg);
    saveNotification(msg);
  };

  socket.on("taskCreated", onCreated);
  socket.on("taskUpdated", onUpdated);
  socket.on("taskDeleted", onDeleted);

  return () => {
    socket.off("taskCreated", onCreated);
    socket.off("taskUpdated", onUpdated);
    socket.off("taskDeleted", onDeleted);
  };
}, []);

  // Delete Task Confirmation
  const confirmDelete = (task: Tasks) => {
    setDeleteConfirm({ show: true, task });
  };

  // Delete Task
  const deleteTask = async () => {
    if (!deleteConfirm.task) return;

    const res = await fetch(`/api/tasks/${deleteConfirm.task.id}`, { method: "DELETE" });

    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== deleteConfirm.task?.id));
      toast.success("Task deleted successfully");
      setDeleteConfirm({ show: false, task: null });
    } else {
      toast.error("Failed to delete task");
      setDeleteConfirm({ show: false, task: null });
    }
  };

 const updateStatus = async (id: number, status: string) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (res.ok) {
    toast.success(`Task → ${status}`);

    // Get updated task from response
    const updated = await res.json();

    // Update UI immediately
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? updated.data : task
      )
    );
  } else {
    toast.error("Failed to update task");
  }
};


  const statusColor = (status: string) => ({
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    progress: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[status] || "bg-gray-50 text-gray-600 border-gray-200");

  const statusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={14} />;
      case "progress": return <Target size={14} />;
      case "completed": return <div className="w-3 h-3 rounded-full bg-current" />;
      default: return <Clock size={14} />;
    }
  };




 




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 ">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            {pathname === "/dashboard" ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Today's Tasks
                </h1>
                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <Clock size={16} />
                  Track time & boost productivity
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Task Manager
                </h1>
                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <Target size={16} />
                  Organize, track, and complete your tasks efficiently
                </p>
              </>
            )}
          </div>
          
          <div>
            {pathname !== "/dashboard" && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <Plus size={20} /> Add New Task
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        {pathname !== "/dashboard" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 flex-1 w-full">
                <Search className="text-gray-400" size={20} />
               <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  placeholder="Search tasks..."
                  className="bg-transparent w-full outline-none"
                />
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <Calendar size={18} className="text-gray-400" />
               <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setPage(1);
                }}
                className="border px-4 py-3 rounded-xl"
              />

              </div>
               <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDate("all");
                  setPage(1);
                }}
                className="px-5 py-3 border rounded-xl"
              >
                Show All
              </button>
            </div>
          </div>
        )}

        {/* Task Grid */}
        {loading ? (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
) : tasks.length === 0 ? (
  <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
      <Target size={40} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
    <p className="text-gray-500 max-w-sm mx-auto">
      {searchTerm || selectedDate !== new Date().toISOString().split("T")[0]
        ? "Try adjusting your search or date filter"
        : "Get started by creating your first task"}
    </p>
    {pathname !== "/dashboard" && (
      <button
        onClick={() => setShowForm(true)}
        className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
      >
        <Plus size={18} /> Create Task
      </button>
    )}
  </div>
) : (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
    {tasks.map((task) => (
      <div
        key={task.id}
        className="bg-white rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      >
        {/* Timer Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
          <TaskTimer taskId={task.id} status={task.status} />
        </div>

        {/* Body */}
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusColor(
                task.status || "pending"
              )}`}
            >
              {statusIcon(task.status || "pending")}
              {task.status?.replace("_", " ") || "Pending"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {task.title}
          </h2>

          <p className="text-gray-600 leading-relaxed text-lg">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 bg-blue-50 rounded-s text-sm text-gray-700 ml-10">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium">{task?.user?.name}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{timeAgo(task.createdAt)}</span>
        </div>

        {/* Controls */}
        <div className="px-8 pb-8 flex gap-3">
          {task.status === "completed" ? (
            <button
              disabled
              className="flex-1 bg-emerald-100 text-emerald-700 text-sm font-semibold py-4 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Completed
            </button>
          ) : task.status === "progress" ? (
            <button
              onClick={() => updateStatus(task.id, "completed")}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Mark Complete
            </button>
          ) : (
            <button
              onClick={() => updateStatus(task.id, "progress")}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Start Task
            </button>
          )}

          {task.status === "pending" && (
            <button
              onClick={() => {
                setEditTask(task);
                setShowForm(true);
              }}
              className="flex-1 border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 text-sm font-medium py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Edit size={16} /> Edit
            </button>
          )}

          <button
            onClick={() => confirmDelete(task)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    ))}
  </div>
)}

        
 {/* 📍 Pagination */}

         {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-6">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded disabled:opacity-50">
              Prev
            </button>

            <span className="font-semibold">Page {page} / {totalPages}</span>

            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded disabled:opacity-50">
              Next
            </button>
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                <button
                  onClick={() => setDeleteConfirm({ show: false, task: null })}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete this task?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">{deleteConfirm.task?.title}</p>
                  {deleteConfirm.task?.description && (
                    <p className="text-red-600 text-sm mt-1">{deleteConfirm.task.description}</p>
                  )}
                </div>
                <p className="text-red-600 text-sm mt-3 font-medium">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ show: false, task: null })}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTask}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}