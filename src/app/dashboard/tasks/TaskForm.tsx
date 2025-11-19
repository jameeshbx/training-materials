"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TaskForm({ task, close, refresh }: any) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const method = task ? "PUT" : "POST";
    const url = task ? `/api/tasks/${task.id}` : "/api/tasks";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      refresh();
      close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-semibold mb-4">
          {task ? "Edit Task" : "Add New Task"}
        </h3>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex gap-3">
          <Button type="submit">{task ? "Update" : "Create"}</Button>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
