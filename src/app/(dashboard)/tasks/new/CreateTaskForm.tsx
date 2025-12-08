"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskForm({ userId }: { userId: string }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          status,
          userId,
          dueDate
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      router.push("/tasks");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Create new task form" className="space-y-4 max-w-md text-white">

      <div>
        <label htmlFor="title" className="block text-sm mb-1">Title</label>
        <input
          id="title"
          aria-required="true"
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300 focus:outline-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm mb-1">Description</label>
        <textarea
          id="description"
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300 focus:outline-blue-400"
          rows={3}
          value={description}
          placeholder="Enter details (optional)"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm mb-1">Status</label>
        <select
          id="status"
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300 focus:outline-blue-400"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Select task status"
        >
          <option className="text-black" value="pending">Pending</option>
          <option className="text-black" value="in-progress">In progress</option>
          <option className="text-black" value="done">Done</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm mb-1">Due Date</label>
        <input
          id="dueDate"
          type="date"
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300 focus:outline-blue-400"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Select due date"
        />
      </div>

      {error && <p className="text-red-400 text-sm" aria-live="assertive">{error}</p>}

      <button
        type="submit"
        aria-label="Create a new task"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>

    </form>
  );
}
