"use client";

import { useState } from "react";
import { createTask } from "@/lib/services/taskservice";

export default function TaskForm({ onSuccess }: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();

        await createTask({
            title,
            description,
            status: "pending",
        });

        setTitle("");
        setDescription("");

        if (onSuccess) onSuccess();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 rounded-md space-y-3"
        >
            <h2 className="font-semibold">Create New Task</h2>

            <input
                className="border w-full p-2 rounded"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="border w-full p-2 rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Add Task
            </button>
        </form>
    );
}
