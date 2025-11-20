
"use client";

import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "@/lib/services/taskservice";
import TaskForm from "@/components/task/taskForm";
import TaskEditForm from "@/components/task/taskEditForm";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState<any>(null);

    async function loadTasks() {
        const data = await getTasks();
        setTasks(data.tasks);
    }

    async function handleDelete(id: string) {
        await deleteTask(id);
        loadTasks();
    }

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Tasks</h1>

            {/* Create Task Form */}
            <TaskForm onSuccess={loadTasks} />

            {/* Task List */}
            <div className="space-y-3">
                {tasks.length === 0 && (
                    <p className="text-gray-500">No tasks found.</p>
                )}

                {tasks.map((task: any) => (
                    <div
                        key={task.id}
                        className="border p-4 rounded-md flex justify-between items-center"
                    >
                        <div>
                            <h2 className="font-bold">{task.title}</h2>
                            <p className="text-sm text-gray-600">{task.description}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Edit Button */}
                            <button
                                onClick={() => setEditingTask(task)}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
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


