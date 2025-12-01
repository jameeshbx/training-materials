"use client";

import { useEffect, useState } from "react";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        try {
            const res = await fetch("/api/admin/audit-logs");
            const data = await res.json();

            if (res.ok) {
                setLogs(data.logs || []);
            }
        } catch (err) {
            console.error("Log fetch error:", err);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadLogs();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-center text-xl font-semibold">
                Loading Logs...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">📜 Audit Logs</h1>

            <div className="bg-white rounded-xl shadow border p-6">
                <div className="overflow-auto max-h-[600px]">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-red-400 font-semibold">
                            <tr>
                                <th className="border px-3 py-2">User</th>
                                <th className="border px-3 py-2">Action</th>
                                <th className="border px-3 py-2">Details</th>
                                <th className="border px-3 py-2">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2 text-gray-600">
                                        {log.user?.email || "System"}
                                    </td>
                                    <td className="border px-3 py-2 font-bold text-gray-600">
                                        {log.action}
                                    </td>
                                    <td className="border px-3 py-2 text-gray-600">{log.details}</td>
                                    <td className="border px-3 py-2 text-gray-600">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {logs.length === 0 && (
                        <p className="text-gray-500 text-center py-5">
                            No audit logs found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
