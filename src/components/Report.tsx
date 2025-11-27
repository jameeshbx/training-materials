"use client";

import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { 
  Clock, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Calendar,
  AlertCircle
} from "lucide-react";

Chart.register(...registerables);

interface WeeklyData {
  user: string;
  hours: number;
}

interface StatusData {
  status: string;
  _count: number;
}

export default function ReportsPage() {
  const [weekly, setWeekly] = useState<WeeklyData[]>([]);
  const [distribution, setDistribution] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [weeklyRes, distributionRes] = await Promise.all([
          fetch("/api/reports/weekly"),
          fetch("/api/reports/distribution")
        ]);
        
        if (!weeklyRes.ok) throw new Error('Failed to fetch weekly data');
        if (!distributionRes.ok) throw new Error('Failed to fetch distribution data');
        
        const weeklyData = await weeklyRes.json();
        const distributionData = await distributionRes.json();
        
        console.log('Weekly Data:', weeklyData);
        console.log('Distribution Data:', distributionData);
        
        // Validate data structure
        const validWeeklyData: WeeklyData[] = Array.isArray(weeklyData) 
          ? weeklyData.filter((item: any) => 
              item && 
              typeof item === 'object' && 
              'user' in item && 
              'hours' in item
            )
          : [];

        const validDistributionData: StatusData[] = Array.isArray(distributionData)
          ? distributionData.filter((item: any) => 
              item && 
              typeof item === 'object' && 
              'status' in item && 
              '_count' in item
            )
          : [];

        setWeekly(validWeeklyData);
        setDistribution(validDistributionData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to load reports data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default color schemes
  const statusColors: Record<string, string> = {
    pending: "#FF6B6B",
    IN_PROGRESS: "#4ECDC4",
    completed: "#45B7D1",
    REVIEW: "#FFA07A",
    BLOCKED: "#FFD93D",
    TODO: "#667eea",
    DONE: "#96ceb4"
  };

  const weeklyColors = [
    "#667eea", "#764ba2", "#f093fb", "#f5576c", 
    "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"
  ];

  // Chart data with fallbacks
  const barData = {
    labels: weekly.length > 0 ? weekly.map((w) => w.user) : ['No Data'],
    datasets: [
      {
        label: "Hours Worked",
        data: weekly.length > 0 ? weekly.map((w) => w.hours) : [0],
        backgroundColor: weeklyColors,
        borderColor: weeklyColors.map(color => color + "DD"),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieData = {
    labels: distribution.length > 0 
      ? distribution.map((d) => d.status) 
      : ['No Data'],
    datasets: [
      {
        data: distribution.length > 0 
          ? distribution.map((d) => d._count) 
          : [1],
        backgroundColor: distribution.length > 0
          ? distribution.map(d => statusColors[d.status] || "#94a3b8")
          : ["#e2e8f0"],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        cornerRadius: 8,
        usePointStyle: true,
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)'
        },
        ticks: {
          color: '#64748b'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b'
        }
      }
    }
  };

  // Calculate totals with fallbacks
  const totalHours = weekly.reduce((sum, item) => sum + item.hours, 0);
  const totalTasks = distribution.reduce((sum, item) => sum + item._count, 0);
  const completedTasks = distribution.find(d => d.status === 'completed' || d.status === 'DONE')?._count || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Reports</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
        
            <p className="text-slate-600 mt-2">Track team performance and task distribution</p>
          </div>
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-slate-200">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Hours</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalHours.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalTasks}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Team Members</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{weekly.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{completionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Hours Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Weekly Hours Per Member
                </h2>
                <p className="text-slate-500 text-sm mt-1">Total hours tracked this week</p>
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                This Week
              </div>
            </div>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Task Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  Task Status Distribution
                </h2>
                <p className="text-slate-500 text-sm mt-1">Breakdown of tasks by status</p>
              </div>
              <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                All Tasks
              </div>
            </div>
            <div className="h-80">
              <Doughnut data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Status Legend */}
        {distribution.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {distribution.map((item) => (
                <div key={item.status} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: statusColors[item.status] || '#94a3b8' 
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 capitalize">{item.status.toLowerCase()}</p>
                    <p className="text-2xl font-bold text-slate-900">{item._count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}