import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return <p className="text-red-500 p-10">Not authorized</p>;
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-slate-800 p-4 rounded-lg shadow border border-gray-700"
          >
            <p><b>Name:</b> {u.name}</p>
            <p><b>Email:</b> {u.email}</p>
            <p><b>Role:</b> {u.role}</p>
            <p><b>Created:</b> {u.createdAt.toISOString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
