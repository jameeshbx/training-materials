"use client";

import { useState } from "react";
import { createTask } from "@/lib/services/taskservice";

export default function TaskForm({ onSuccess }: any) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    async function handleSubmit(e: any) {
        e.preventDefault();

        await createTask({
            title,
            description,
            dueDate,
            status: "pending",
        });

        setTitle("");
        setDescription("");
        setDueDate("");

        if (onSuccess) onSuccess();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border p-4 rounded-md space-y-3 max-w-md mx-auto bg-white text-black"
        >
            <h2 className="font-semibold text-gray-800">Create New Task</h2>

            {/* TITLE */}
            <input
                className="border w-full p-2 rounded"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            {/* DESCRIPTION */}
            <textarea
                className="border w-full p-2 rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* DUE DATE */}
            <div>
                <label className="block mb-1 text-gray-700 font-medium">Due Date</label>
                <input
                    type="date"
                    className="border w-full p-2 rounded"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Add Task
            </button>
        </form>
    );
}
