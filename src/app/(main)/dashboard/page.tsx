
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ActivityFeedWrapper from "@/components/ActivityFeedWrapper";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div className="flex items-center justify-center h-screen text-white">
                <h1 className="text-xl">Not authenticated</h1>
            </div>
        );
    }

    const userId = session.user.id;

    
    const activeTimer = await prisma.timeEntry.findFirst({
        where: { userId, endAt: null },
        include: { task: true },
    });

    
    const todaysTasks = await prisma.task.findMany({
        where: {
            assigneeId: userId,
            dueDate: { not: null },
        },
        orderBy: {
            dueDate: "asc", 
        },
        take: 5,
    });

    
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekEntries = await prisma.timeEntry.findMany({
        where: {
            userId,
            startAt: { gte: startOfWeek },
            endAt: { not: null },
        },
    });

    const weeklySeconds = weekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    const weeklyHours = (weeklySeconds / 3600).toFixed(1);

   
    return (
        <div className="px-6 py-10 text-white space-y-10 max-w-6xl mx-auto">

           
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-300">Welcome back, {session.user?.name} 👋</p>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              
                <div className="bg-[#1b1c1f] border border-gray-700 p-5 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-2">⏱ Active Timer</h2>
                    {activeTimer ? (
                        <div>
                            <p className="text-sm text-gray-300">
                                Task: <span className="font-medium text-white">{activeTimer.task?.title}</span>
                            </p>
                            <p className="mt-2 text-base font-bold text-green-400">Timer Running...</p>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No active timer</p>
                    )}
                </div>

               
                <div className="bg-[#1b1c1f] border border-gray-700 p-5 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-3">📅 Today’s Tasks</h2>

                    {todaysTasks.length === 0 ? (
                        <p className="text-gray-400 text-sm">No tasks with due date</p>
                    ) : (
                        <ul className="space-y-2">
                            {todaysTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="text-sm text-gray-300 truncate border-b border-gray-700 pb-1"
                                >
                                    {task.title}
                                    <div className="text-xs text-gray-400">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

               
                <div className="bg-[#1b1c1f] border border-gray-700 p-5 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-3">⏳ Weekly Hours</h2>
                    <p className="text-3xl font-bold text-blue-400">{weeklyHours}h</p>
                    <p className="text-gray-400 text-xs mt-1">Tracked this week</p>
                </div>
            </div>
            <div className="mt-10">
                <ActivityFeedWrapper teamId="default-team" />
            </div>
        </div>
    );
}
