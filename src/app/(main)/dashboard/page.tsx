import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // This will never show because middleware already protects the route,
    // but it's good to keep for server clarity.
    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen text-white">
                <h1 className="text-xl">Not authenticated</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start justify-center h-full pt-10 px-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <p className="text-lg">Welcome, {session.user?.name} 👋</p>
            <p className="text-gray-300">Email: {session.user?.email}</p>
        </div>
    );
}
