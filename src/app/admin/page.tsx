import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Only admins can access this page
  if (!session || session.user.role !== "ADMIN") {
    return (
      <p className="text-red-500 p-10">
        Not authorized. Admin access only.
      </p>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="space-y-4">
        <a
          href="/admin/users"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg inline-block"
        >
          👥 View All Users
        </a>

        <a
          href="/dashboard"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg inline-block"
        >
          🏠 Back to User Dashboard
        </a>
      </div>
    </div>
  );
}
