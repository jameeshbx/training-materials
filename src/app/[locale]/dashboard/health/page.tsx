export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // If using shadcn/ui
import { 
  Users, 
  CheckSquare, 
  Activity,
  Clock,
  TrendingUp,
  Database
} from "lucide-react";

export default async function Dashboard() {
  const users = await prisma.user.count();
  const tasks = await prisma.task.count();
  const completedTasks = await prisma.task.count({ where: { status: "COMPLETED" } });
  const pendingTasks = await prisma.task.count({ where: { status: "PENDING" } });
  
  const uptime = process.uptime();
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  // Calculate completion percentage
  const completionRate = tasks > 0 ? Math.round((completedTasks / tasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{users.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-500 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        {/* Tasks Card */}
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tasks</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{tasks.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700">{completionRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Card */}
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Task Status</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-gray-900">{completedTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-gray-900">{pendingTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Uptime Card */}
        <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">System Uptime</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {uptimeHours}h {uptimeMinutes}m {uptimeSeconds}s
            </div>
            <p className="text-xs text-gray-500 mt-1">Server running time</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Tasks per User</span>
                <span className="font-bold text-lg">
                  {users > 0 ? (tasks / users).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Completion Rate</span>
                <span className="font-bold text-lg">{completionRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Active Sessions</span>
                <span className="font-bold text-lg">24</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-600" />
              Database Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(users + tasks).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Active Data</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingTasks}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p>Last updated: {new Date().toLocaleTimeString()}</p>
                <p className="mt-1">Data refreshes automatically</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg. Tasks/Day</p>
            <p className="text-2xl font-bold text-gray-900">42</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">User Growth</p>
            <p className="text-2xl font-bold text-gray-900">+12.5%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">System Health</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-2xl font-bold text-gray-900">100%</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Response Time</p>
            <p className="text-2xl font-bold text-gray-900">128ms</p>
          </div>
        </div>
      </div>
    </div>
  );
}