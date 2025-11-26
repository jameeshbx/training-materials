"use client";
import { useState } from "react";
import { X, Save } from "lucide-react";
import { getSocket } from "@/lib/socket"; // <-- FIXED IMPORT

export default function TaskForm({ task, close, refresh }: any) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState(task?.dueDate?.split("T")[0] || "");

  // TaskForm.tsx - FIXED
const handleSubmit = async (e: any) => {
  e.preventDefault();
  if (!title.trim()) return;

  setLoading(true);

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, dueDate }),
    });

    if (res.ok) {
      const json = await res.json(); 

      // 🔥 Socket emit with error handling
      if (!task) {
        try {
          const socket = getSocket();
          if (socket.connected) {
            socket.emit("taskCreated", json.data);
          } else {
            console.log("Socket not connected, reconnecting...");
            socket.connect();
            socket.emit("taskCreated", json.data);
          }
        } catch (socketError) {
          console.error("Socket emit error:", socketError);
        }
      }

      refresh();
      close();
    }
  } catch (error) {
    console.error("Error saving task:", error);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {task ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={close}
            className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* fields */}
          {/* ... keep same */}
        </form>
      </div>
    </div>
  );
}
