

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
            <div className="p-6 text-center text-xl font-semibold animate-pulse text-gray-700">
                Loading Logs...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-4xl font-extrabold text-black">
                📜 Audit Logs
            </h1>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 transition hover:shadow-2xl">
                <div className="overflow-auto max-h-[600px] rounded-xl">
                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-gradient-to-r from-red-500 to-red-400 text-white sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left">User</th>
                                <th className="px-4 py-3 text-left">Action</th>
                                <th className="px-4 py-3 text-left">Details</th>
                                <th className="px-4 py-3 text-left">Time</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log: any) => (
                                <tr
                                    key={log.id}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-gray-700">
                                        {log.user?.email || "System"}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">
                                        {log.action}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {log.details}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {logs.length === 0 && (
                        <p className="text-gray-500 text-center py-6 text-lg">
                            No audit logs found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
