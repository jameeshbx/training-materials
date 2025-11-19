"use client";
import { useEffect, useState } from "react";
import { Tasks } from "@/types/user";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskForm from "@/app/dashboard/tasks/TaskForm";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Tasks | null>(null);

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete Task
  const deleteTask = async (id: number) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Tasks</h2>
        <Button onClick={() => setShowForm(true)}>➕ Add Task</Button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-md">Task: {task.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600">{task.description}</p>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditTask(task);
                      setShowForm(true);
                    }}
                  >
                    ✏ Edit
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}>
                    ❌ Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <TaskForm
          task={editTask}
          close={() => {
            setShowForm(false);
            setEditTask(null);
          }}
          refresh={fetchTasks}
        />
      )}
    </div>
  );
}
