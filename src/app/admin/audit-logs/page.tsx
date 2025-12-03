"use client";

import { useEffect, useState } from "react";

type AuditLog = {
  id: string;
  action: string;
  entity: string;
  details: Record<string, any> | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/audit-logs");
        const result = await res.json();

        if (result.success) {
          // API returns data in `data` property
          setLogs(result.data || []);
        } else {
          console.error("Failed to fetch audit logs:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const formatDetails = (details: Record<string, any> | null) => {
    if (!details || typeof details !== "object" || Object.keys(details).length === 0) {
      return <span className="text-gray-400 italic">No details</span>;
    }

    return (
      <ul className="space-y-1">
        {Object.entries(details).map(([key, value]) => (
          <li key={key} className="text-sm">
            <strong>{key}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return <div className="p-6">Loading audit logs...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Audit Logs</h1>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Entity</th>
              <th className="p-3 text-left">Details</th>
              {/* <th className="p-3 text-left">IP</th> */}
              {/* <th className="p-3 text-left">User Agent</th> */}
              <th className="p-3 text-left">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{log.user?.email || "Unknown"}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.entity}</td>
                  <td className="p-3">{formatDetails(log.details)}</td>
                  {/* <td className="p-3">{log.ip || "N/A"}</td> */}
                  {/* <td className="p-3 max-w-[200px] break-words">{log.userAgent || "N/A"}</td> */}
                  <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
