"use client";
import { useState } from "react";
import { X, Save } from "lucide-react";

export default function TaskForm({ task, close, refresh }: any) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState(task?.dueDate?.split("T")[0] || "");
  const [dateInputType, setDateInputType] = useState<"date" | "text">("date");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const method = task ? "PUT" : "POST";
    const url = task ? `/api/tasks/${task.id}` : "/api/tasks";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          dueDate 
        }),
      });

      if (res.ok) {
        refresh();
        close();
      }
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date for manual input (YYYY-MM-DD)
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (dateInputType === "text") {
      // Allow manual typing - basic validation for YYYY-MM-DD format
      setDueDate(value);
    } else {
      setDueDate(value);
    }
  };

  // Validate date format
  const isValidDate = (dateString: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
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
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe your task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date *
              </label>
              <button
                type="button"
                onClick={() => setDateInputType(dateInputType === "date" ? "text" : "date")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {dateInputType === "date" ? "Type manually" : "Use calendar"}
              </button>
            </div>

            <input
              id="dueDate"
              type={dateInputType}
              value={dueDate}
              onChange={handleDateChange}
              min={dateInputType === "date" ? new Date().toISOString().split("T")[0] : undefined}
              placeholder={dateInputType === "text" ? "YYYY-MM-DD" : undefined}
              pattern={dateInputType === "text" ? "\\d{4}-\\d{2}-\\d{2}" : undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            
            {dateInputType === "text" && dueDate && !isValidDate(dueDate) && (
              <p className="text-sm text-red-600 mt-1">
                Please enter date in YYYY-MM-DD format
              </p>
            )}
            
            {dateInputType === "text" && (
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY-MM-DD (e.g., 2024-12-25)
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !title.trim() || !isValidDate(dueDate)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : (task ? "Update Task" : "Create Task")}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={loading}
              className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}