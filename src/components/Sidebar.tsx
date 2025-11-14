import Link from "next/link";
import { Home, Users, ClipboardList, FileBarChart } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-green-300 shadow-xl p-5">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          href="/dashboard/teams"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
        >
          <Users size={18} />
          Teams
        </Link>

        <Link
          href="/dashboard/tasks"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
        >
          <ClipboardList size={18} />
          Tasks
        </Link>

        <Link
          href="/dashboard/reports"
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
        >
          <FileBarChart size={18} />
          Report
        </Link>
      </nav>
    </div>
  );
}
