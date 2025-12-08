"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import { useLocale } from "next-intl";

import { 
  Users, 
  Settings, 
  LogOut, 
  UserPlus,
  Shield,
  BarChart3,
  FileText,
  Bell,
  ClipboardList,
  Clock
} from "lucide-react";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface TaskType {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  userId: number;
  createdAt: string;
}

export default function AdminClientPage({ session }: any) {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalTasks: 0
  });
const locale = useLocale();
  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        return data.users || [];
      }
      return [];
    } catch (error) {
      console.log("Error fetching users:", error);
      return [];
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.data || []);
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.log("Error fetching tasks:", error);
      return [];
    }
  };

  const calculateStats = (usersData: UserType[], tasksData: TaskType[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate active users today (users created today)
    const activeToday = usersData.filter(user => 
      user.createdAt.split('T')[0] === today
    ).length;

    // Calculate task statistics
    const pendingTasks = tasksData.filter(task => 
      task.status === 'pending' || task.status === 'progress'
    ).length;
    
    const completedTasks = tasksData.filter(task => 
      task.status === 'completed'
    ).length;

    const totalTasks = tasksData.length;

    setStats({
      totalUsers: usersData.length,
      activeToday,
      pendingTasks,
      completedTasks,
      totalTasks
    });
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersData, tasksData] = await Promise.all([
        fetchUsers(),
        fetchTasks()
      ]);
      calculateStats(usersData, tasksData);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const adminCards = [
  {
    title: "Manage Users",
    description: `Manage ${stats.totalUsers} users`,
    icon: Users,
    path:   `/${locale}/admin/userlist`,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Send Invitations",
    description: "Invite new users to the platform",
    icon: UserPlus,
    path: `/${locale}/admin/invite`,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Notifications",
    description: "Manage system notifications",
    icon: Bell,
    path: `/${locale}/dashboard/notifications`,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  },  // <-- Added comma here
  {
    title: "Audit-log",
    description: "All Logs",
    icon: Bell,
    path: `/${locale}/admin/audit-logs`,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-600"
  }
];
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  Welcome back, <span className="font-semibold text-slate-800">{session.user.email}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {session.user.role}
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Administrator
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 lg:mt-0">
            <button
              onClick={() => fetchAllData()}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.totalUsers / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Pending Tasks Card - Replaced Active Today */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingTasks}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.totalTasks > 0 ? (stats.pendingTasks / stats.totalTasks) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.completedTasks}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <ClipboardList className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalTasks}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 h-2 bg-slate-100 rounded-full">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.totalTasks / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Admin Tools Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Settings className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Tools</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  onClick={() => router.push(card.path)}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <Icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    {card.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-1 bg-gradient-to-r ${card.color} rounded-full`}></div>
                    <div className="text-slate-400 group-hover:text-slate-600 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}