import { db } from "@/lib/db";
import { InviteForm } from "@/components/InviteForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Only allow admin to view this page
  if (user?.role !== "ADMIN") {
    return (
      <div className="p-10 text-red-500">
        Not authorized. Only admins can view this page.
      </div>
    );
  }

  // Get the first team (or the admin’s default team)
  const team = await db.team.findFirst();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <Link
          href="/admin/users"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          View All Users
        </Link>

        <Link
          href="/dashboard"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Back to User Dashboard
        </Link>
      </div>

      {/* Show InviteForm here */}
      {team && (
        <div className="mt-10 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Invite Member</h2>
          <InviteForm teamId={team.id} />
        </div>
      )}
    </div>
  );
}
