"use client";

import { useRouter } from "next/navigation";
import InviteForm from "@/components/inviteform";

export default function AdminDashboard() {
  const router = useRouter();

  return (
  <div className="min-h-screen bg-gray-50 text-black py-10 px-4">
    {/* Header */}
    <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage users, system logs and invitations
        </p>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          User Management
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          View and manage all registered users.
        </p>
        <button
          onClick={() => router.push("/admin/users")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          View Users →
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Audit Logs
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Track system activity and user actions.
        </p>
        <button
          onClick={() => router.push("/admin/audit-logs")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          View Logs →
        </button>
      </div>
    </div>

    {/* Invite Section */}
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent italic">
          Invite New Users
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Send email invitations to onboard new team members.
        </p>
      </div>

      <InviteForm />
    </div>
  </div>
);
}
// import InviteForm from "@/components/inviteform";

// export default function AdminPage() {
//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       <InviteForm />
//     </div>
//   );
// }