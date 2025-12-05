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
  AlertCircle,
  BarChart3,
  PieChart
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

  // Enhanced color schemes
  const statusColors: Record<string, string> = {
    pending: "#FF6B6B",
    IN_PROGRESS: "#4ECDC4",
    completed: "#45B7D1",
    REVIEW: "#FFA07A",
    BLOCKED: "#FFD93D",
    TODO: "#667eea",
    DONE: "#96ceb4",
    CANCELLED: "#94a3b8"
  };

  // Professional gradient colors for weekly hours
  const weeklyColors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    "linear-gradient(135deg, #a6c0fe 0%, #f68084 100%)"
  ];

  // Solid colors for hover states
  const weeklySolidColors = [
    "#667eea", "#f093fb", "#4ecdc4", "#a8edea", 
    "#ffecd2", "#84fab0", "#d4fc79", "#a6c0fe"
  ];

  // Chart data with enhanced styling
  const barData = {
    labels: weekly.length > 0 ? weekly.map((w) => w.user) : ['No Data'],
    datasets: [
      {
        label: "Hours Worked",
        data: weekly.length > 0 ? weekly.map((w) => w.hours) : [0],
        backgroundColor: weekly.length > 0 
          ? weeklyColors.slice(0, weekly.length) 
          : ["linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)"],
        borderColor: weekly.length > 0 
          ? weeklySolidColors.slice(0, weekly.length).map(color => color + "DD") 
          : ["#94a3b8"],
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: weekly.length > 0 
          ? weeklySolidColors.slice(0, weekly.length).map(color => color + "CC")
          : ["#cbd5e1"],
        hoverBorderWidth: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const pieData = {
    labels: distribution.length > 0 
      ? distribution.map((d) => d.status.replace('_', ' ')) 
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
        borderWidth: 4,
        hoverBorderWidth: 6,
        hoverOffset: 20,
        spacing: distribution.length > 0 ? 2 : 0,
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
          padding: 25,
          font: {
            size: 13,
            family: "'Inter', sans-serif",
            weight: 500,
          },
          color: '#475569',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 2,
        cornerRadius: 12,
        usePointStyle: true,
        padding: 16,
        boxPadding: 8,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || context.raw;
            const suffix = context.chart.data.labels[context.dataIndex] === 'Hours Worked' ? ' hrs' : ' tasks';
            return `${label}: ${value}${suffix}`;
          }
        }
      }
    }
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.8)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 10,
          callback: function(value: any) {
            return value + ' hrs';
          }
        },
        border: {
          display: false,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
            weight: 500,
          },
          padding: 15,
        },
        border: {
          display: false,
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const,
    }
  };

  const pieOptions = {
    ...chartOptions,
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutQuart' as const,
    }
  };

  // Calculate totals with fallbacks
  const totalHours = weekly.reduce((sum, item) => sum + item.hours, 0);
  const totalTasks = distribution.reduce((sum, item) => sum + item._count, 0);
  const completedTasks = distribution.find(d => d.status === 'completed' || d.status === 'DONE')?._count || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Error Loading Reports</h2>
          <p className="text-slate-600 mb-6 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
              Team Analytics
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl">
              Comprehensive overview of team performance, task distribution, and productivity metrics
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-lg border border-slate-200/60">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span className="text-slate-800 font-semibold text-lg">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: "Total Hours", 
              value: totalHours.toFixed(1), 
              icon: Clock, 
              color: "blue",
              gradient: "from-blue-500 to-cyan-500"
            },
            { 
              label: "Total Tasks", 
              value: totalTasks.toString(), 
              icon: CheckCircle, 
              color: "green",
              gradient: "from-green-500 to-emerald-500"
            },
            { 
              label: "Team Members", 
              value: weekly.length.toString(), 
              icon: Users, 
              color: "purple",
              gradient: "from-purple-500 to-indigo-500"
            },
            { 
              label: "Completion Rate", 
              value: `${completionRate.toFixed(1)}%`, 
              icon: TrendingUp, 
              color: "green",
              gradient: "from-green-500 to-emerald-500"
            }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Hours Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Weekly Hours Distribution
                  </h2>
                  <p className="text-slate-500 text-sm">Hours tracked per team member this week</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Real-time
              </div>
            </div>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Task Distribution Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Task Status Overview
                  </h2>
                  <p className="text-slate-500 text-sm">Breakdown of tasks by current status</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                All Time
              </div>
            </div>
            <div className="h-80">
              <Doughnut data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Enhanced Status Legend */}
        {distribution.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-slate-700" />
              <h3 className="text-xl font-bold text-slate-900">Status Breakdown</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {distribution.map((item) => (
                <div 
                  key={item.status} 
                  className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200 group"
                >
                  <div 
                    className="w-4 h-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200"
                    style={{ 
                      backgroundColor: statusColors[item.status] || '#94a3b8',
                      boxShadow: `0 4px 12px ${statusColors[item.status] || '#94a3b8'}40`
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 capitalize truncate">
                      {item.status.toLowerCase().replace('_', ' ')}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{item._count}</p>
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    {totalTasks > 0 ? ((item._count / totalTasks) * 100).toFixed(1) : 0}%
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