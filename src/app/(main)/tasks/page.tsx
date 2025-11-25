
"use client"

import { useEffect, useState } from "react"
import { getTasks, deleteTask } from "@/lib/services/taskservice"
import TaskEditForm from "@/components/task/taskEditForm"
import Timer from "@/components/task/timer"
import Link from "next/link"

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState<any>(null)

  async function loadTasks() {
    const data = await getTasks()
    setTasks(data.tasks)
  }

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this task?")
    if (!ok) return
    await deleteTask(id)
    loadTasks()
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
     
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Tasks</h1>

        <Link
          href="/tasks/addTask"
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm"
        >
          + Add Task
        </Link>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {tasks.length === 0 && (
          <p className="text-gray-500 text-center py-8 border rounded-lg col-span-full text-sm">
            No tasks found. Click <strong>Add Task</strong> to create your first task.
          </p>
        )}

        {tasks.map((task: any) => {
          const latestEntry = task.timeEntries?.[0]
          console.log("kkkkk", latestEntry)
          return (
            <div
              key={task.id}
              className="border border-gray-200 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
            >
             
              <div className="flex-1 min-h-0 mb-3 overflow-hidden">
                <h2 className="text-base font-semibold text-gray-800 truncate">
                  {task.title}
                </h2>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                  {task.description || "No description"}
                </p>

                
                {task.dueDate && (
                  <p className="text-xs text-red-600 mt-2 font-medium">
                    <strong>Due:</strong>{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

            
              {latestEntry && (
                <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs mb-3">
                  {latestEntry.startAt && (
                    <p className="text-gray-700">
                      <strong>Start:</strong>{" "}
                      {new Date(latestEntry.startAt).toLocaleString()}
                    </p>
                  )}
                  {latestEntry.endAt && (
                    <p className="text-gray-700">
                      <strong>End:</strong>{" "}
                      {new Date(latestEntry.endAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

             
              <div className="bg-gray-50 p-2 rounded border border-gray-100 text-xs mb-3">
                <Timer taskId={task.id} />
              </div>

              
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setEditingTask(task)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline flex-1"
                >
                  Edit
                </button>
                <div className="w-px h-4 bg-gray-200"></div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {editingTask && (
        <TaskEditForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSuccess={() => {
            setEditingTask(null)
            loadTasks()
          }}
        />
      )}
    </div>
  )
}

