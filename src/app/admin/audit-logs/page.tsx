"use client";

import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/audit-logs");
        const data = await res.json();
        setLogs(data.logs);
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-400">Loading audit logs...</div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Audit Logs</h1>

      {logs.length === 0 ? (
        <p className="text-gray-400 text-center">No logs available.</p>
      ) : (
        <div className="overflow-auto rounded-lg border border-slate-700">
          <table className="w-full border-collapse text-left text-sm text-gray-300">
            <thead className="bg-slate-800 text-gray-300 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Target ID</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log: any, index: number) => (
                <tr
                  key={log.id}
                  className={`border-b border-slate-700 ${
                    index % 2 === 0 ? "bg-slate-900" : "bg-slate-800"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-blue-400">
                    {log.action.replace(/_/g, " ")}
                  </td>

                  <td className="px-4 py-3 text-white">
                    {log.userName || log.user?.name || "Unknown User"}
                  </td>

                  <td className="px-4 py-3">{log.targetType || "-"}</td>

                  <td className="px-4 py-3 text-gray-300">{log.targetId}</td>

                  <td className="px-4 py-3 text-gray-400">
                    {log.meta
                      ? Object.entries(log.meta)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
