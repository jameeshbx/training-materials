
"use client";

import { useState } from "react";
import { updateTask } from "@/lib/services/taskservice";

export default function TaskEditForm({ task, onClose, onSuccess }: any) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split("T")[0] : "");

    async function handleUpdate(e: any) {
        e.preventDefault();

        await updateTask({
            id: task.id,
            title,
            description,
            dueDate,  // ⭐ SEND DUE DATE TO BACKEND
            status: task.status,
        });

        if (onSuccess) onSuccess();
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[#1b1c1f] w-full max-w-md rounded-xl shadow-xl p-6 space-y-5 border border-gray-700 text-white">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Edit Task
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-[#2b2b2b] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-[#2b2b2b] dark:text-white h-28 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                        />
                    </div>

                    {/* ⭐ NEW: DUE DATE FIELD */}
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-[#2b2b2b] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
