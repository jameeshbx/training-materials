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
          userId, // ← REAL LOGGED-IN USER ID
          dueDate, 
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create task");
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-white">

      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          className="w-full rounded-md px-3 py-2 text-white border border-gray-300"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option className="text-black" value="pending">Pending</option>
          <option className="text-black" value="in-progress">In progress</option>
          <option className="text-black" value="done">Done</option>
        </select>
      </div>

      <div>
  <label className="block text-sm mb-1">Due Date</label>
  <input
    type="date"
    className="w-full rounded-md px-3 py-2 text-white border border-gray-300"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
    required
  />
</div>

      

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg"
      >
        {loading ? "Creating..." : "Create Task"}
      </button>

    </form>
  );
}
