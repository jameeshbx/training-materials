"use client";

import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/lib/services/taskservice";
import TaskEditForm from "@/components/task/taskEditForm";
import Timer from "@/components/task/timer";
import Link from "next/link";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState<any>(null);

    async function loadTasks() {
        const data = await getTasks();
        setTasks(data.tasks);
    }

    async function handleDelete(id: string) {
        const ok = confirm("Are you sure you want to delete this task?");
        if (!ok) return;
        await deleteTask(id);
        loadTasks();
    }

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">

            {/* PAGE HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tasks</h1>

                {/* ADD TASK BUTTON */}
                <Link
                    href="/tasks/addTask"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                    + Add Task
                </Link>
            </div>

            {/* TASKS SECTION */}
            <div className="space-y-4">
                {tasks.length === 0 && (
                    <p className="text-gray-500 text-center py-10 border rounded-lg">
                        No tasks found. Click <strong>Add Task</strong> to create your first task.
                    </p>
                )}

                {tasks.map((task: any) => {
                    const latestEntry = task.timeEntries?.[0]; // 👈 latest start/end time

                    return (
                        <div
                            key={task.id}
                            className="border border-gray-300 bg-gray p-5 rounded-xl shadow-sm hover:shadow-md transition space-y-4"
                        >
                            {/* TASK HEADER */}
                            <div className="flex justify-between items-start w-full">
                                <div className="max-w-[70%]">
                                    {/* TITLE — TRUNCATED */}
                                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                                        {task.title}
                                    </h2>

                                    {/* DESCRIPTION — MAX 2 LINES */}
                                    <p className="text-gray-600 mt-1 line-clamp-2">
                                        {task.description}
                                    </p>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setEditingTask(task)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* START & END TIME SECTION */}
                            {latestEntry && (
                                <div className="bg-gray p-3 rounded-lg border border-gray-200 space-y-1">
                                    {latestEntry.startAt && (
                                        <p className="text-sm text-white-700">
                                            <strong>Start Time:</strong>{" "}
                                            {new Date(latestEntry.startAt).toLocaleString()}
                                        </p>
                                    )}

                                    {latestEntry.endAt && (
                                        <p className="text-sm text-white-700">
                                            <strong>End Time:</strong>{" "}
                                            {new Date(latestEntry.endAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* TIMER */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <Timer taskId={task.id} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* EDIT MODAL */}
            {editingTask && (
                <TaskEditForm
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSuccess={() => {
                        setEditingTask(null);
                        loadTasks();
                    }}
                />
            )}
        </div>
    );
}




