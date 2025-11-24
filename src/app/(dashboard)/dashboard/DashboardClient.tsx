"use client";

import Link from "next/link";

export default function DashboardClient({ todaysTasks, role }) {
  return (
    <div className="p-6 text-white">

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {role === "ADMIN" && (
        <Link
          href="/admin/users"
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white mb-6 inline-block"
        >
          👤 View All Users
        </Link>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">
          Today’s Due Tasks
        </h2>

        {todaysTasks.length === 0 ? (
          <p>No tasks due today.</p>
        ) : (
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <div key={task.id} className="bg-slate-800 p-4 rounded-md">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                {task.dueDate && (
                  <p className="text-gray-300 text-sm">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
