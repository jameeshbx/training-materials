// "use client";
// import { useEffect, useState } from "react";
// import { Bar, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// type WeeklyRow = { week_start: string; user_id: string; hours: number };
// type DistRow = { label: string; value: number };
// type User = { id: string; name: string | null; email: string };

// export default function ReportsPage() {
//   const [weekly, setWeekly] = useState<WeeklyRow[]>([]);
//   const [dist, setDist] = useState<DistRow[]>([]);
//   const [usersMap, setUsersMap] = useState<Record<string, string>>({});

//   // Color palette
//   const COLORS = [
//     "#4F46E5", "#22C55E", "#EC4899", "#F59E0B",
//     "#3B82F6", "#A855F7", "#EF4444", "#14B8A6", "#8B5CF6",
//   ];

//   useEffect(() => {
//     // fetch users
//     fetch("/api/users")
//       .then((r) => r.json())
//       .then((users: User[]) => {
//         const map: Record<string, string> = {};
//         users.forEach((u) => {
//           map[u.id] = u.name || u.email || "Unknown";
//         });
//         setUsersMap(map);
//       });

//     // fetch weekly hours
//     fetch("/api/reports/weekly-hours?from=2025-01-01&to=2025-12-31")
//       .then((r) => r.json())
//       .then(setWeekly);

//     // fetch task distribution
//     fetch("/api/reports/task-distribution")
//       .then((r) => r.json())
//       .then(setDist);
//   }, []);

//   // Unique week list
//   const weeks = Array.from(new Set(weekly.map((w) => w.week_start))).sort();

//   // Unique user IDs
//   const userIds = Array.from(new Set(weekly.map((w) => w.user_id)));

//   // Build datasets for bar chart
//   const datasets = userIds.map((uid, index) => ({
//     label: usersMap[uid] ?? `User ${uid}`,
//     data: weeks.map((week) => {
//       const row = weekly.find(
//         (r) => r.week_start === week && r.user_id === uid
//       );
//       return row ? Number(row.hours.toFixed(2)) : 0;
//     }),
//     backgroundColor: COLORS[index % COLORS.length],
//     borderWidth: 2,
//     borderColor: "#ffffff",
//     borderRadius: 6,
//   }));

//   const barData = {
//     labels: weeks,
//     datasets,
//   };

//   const doughnutData = {
//     labels: dist.map((d) => d.label),
//     datasets: [
//       {
//         data: dist.map((d) => d.value),
//         backgroundColor: ["#22C55E", "#3B82F6", "#F59E0B", "#EC4899", "#EF4444"],
//         borderColor: "#ffffff",
//         borderWidth: 2,
//       },
//     ],
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 space-y-3">
//       <h1 className="text-2xl font-bold">Reports</h1>

//       <div className="flex flex-col md:flex-row gap-8">
        
//         {/* --- WEEKLY HOURS --- */}
//         <section className="flex-1">
//           <h2 className="text-lg font-semibold">Weekly hours per team member</h2>
//           <div className="bg-white p-4 rounded shadow">
//             <Bar
//               data={barData}
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: { position: "top" },
//                 },
//               }}
//             />
//           </div>
//         </section>

//         {/* --- TASK DISTRIBUTION --- */}
//         <section className="flex-1 max-w-md">
//           <h2 className="text-lg font-semibold">Task distribution</h2>
//           <div className="bg-white p-4 rounded shadow">
//             <Doughnut
//               data={doughnutData}
//               options={{
//                 plugins: {
//                   legend: { position: "bottom" },
//                 },
//               }}
//             />
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }


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
          fetch("/api/reports/weekly-hours"),
          fetch("/api/reports/task-distribution")
        ]);

        if (!weeklyRes.ok) throw new Error('Failed to fetch weekly data');
        if (!distributionRes.ok) throw new Error('Failed to fetch distribution data');

        const weeklyData = await weeklyRes.json();
        const distributionData = await distributionRes.json();

        const validWeeklyData: WeeklyData[] = Array.isArray(weeklyData)
          ? weeklyData.filter((item: any) =>
              item && typeof item === 'object' && 'user' in item && 'hours' in item
            )
          : [];

        const validDistributionData: StatusData[] = Array.isArray(distributionData)
          ? distributionData.filter((item: any) =>
              item && typeof item === 'object' && 'status' in item && '_count' in item
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

  // Color theme
  const statusColors: Record<string, string> = {
    pending: "#F59E0B",
    IN_PROGRESS: "#10B981",
    completed: "#6366F1",
    REVIEW: "#8B5CF6",
    BLOCKED: "#EF4444",
    TODO: "#3B82F6",
    DONE: "#14B8A6",
    CANCELLED: "#64748B"
  };

  const weeklyColors = [
    "#3B82F6", "#6366F1", "#8B5CF6", "#10B981",
    "#14B8A6", "#F59E0B", "#EF4444", "#EC4899"
  ];

  // Chart Data
  const barData = {
    labels: weekly.length > 0 ? weekly.map(w => w.user) : ['No Data'],
    datasets: [
      {
        label: "Hours Worked",
        data: weekly.length > 0 ? weekly.map(w => w.hours) : [0],
        backgroundColor: weeklyColors.slice(0, weekly.length),
        borderColor: weeklyColors.slice(0, weekly.length).map(c => c + "CC"),
        borderWidth: 3,
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: weeklyColors.slice(0, weekly.length).map(c => c + "AA"),
        hoverBorderWidth: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const pieData = {
    labels: distribution.length > 0
      ? distribution.map(d => d.status.replace('_', ' '))
      : ['No Data'],
    datasets: [
      {
        data: distribution.length > 0 ? distribution.map(d => d._count) : [1],
        backgroundColor: distribution.length > 0
          ? distribution.map(d => statusColors[d.status] || "#64748B")
          : ["#CBD5E1"],
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
            weight: 500,  // Changed from string '500' to number 500
          },
          color: '#475569',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#E5E7EB',
        borderWidth: 2,
        cornerRadius: 12,
        usePointStyle: true,
        padding: 16,
        boxPadding: 8,
        titleFont: {
          size: 14,
          weight: 600 as const,  // Changed from string '600' to number 600
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed?.y ?? context.raw;
            const suffix = label === 'Hours Worked' ? ' hrs' : ' tasks';
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
          color: 'rgba(229, 231, 235, 0.8)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748B',
          font: { 
            size: 12, 
            family: "'Inter', sans-serif" 
          },
          padding: 10,
          callback: function(value: any) { return value + ' hrs'; }
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#64748B',
          font: { 
            size: 12, 
            family: "'Inter', sans-serif", 
            weight: 500  // Changed from string '500' to number 500
          },
          padding: 15,
        },
        border: { display: false },
      }
    },
    animation: { 
      duration: 1000, 
      easing: 'easeOutQuart' as const 
    }
  };

  const pieOptions = {
    ...chartOptions,
    cutout: '65%',
    animation: { 
      animateScale: true, 
      animateRotate: true, 
      duration: 1200, 
      easing: 'easeOutQuart' as const 
    }
  };

  const totalHours = weekly.reduce((sum, item) => sum + item.hours, 0);
  const totalTasks = distribution.reduce((sum, item) => sum + item._count, 0);
  const completedTasks = distribution.find(d => d.status === 'completed' || d.status === 'DONE')?._count || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Error Loading Reports</h2>
          <p className="text-slate-600 mb-6 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-teal-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-grey bg-clip-text text-transparent">
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
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Hours", value: totalHours.toFixed(1), icon: Clock, gradient: "from-teal-500 to-cyan-500" },
            { label: "Total Tasks", value: totalTasks.toString(), icon: CheckCircle, gradient: "from-indigo-500 to-purple-500" },
            { label: "Team Members", value: weekly.length.toString(), icon: Users, gradient: "from-purple-500 to-indigo-500" },
            { label: "Completion Rate", value: `${completionRate.toFixed(1)}%`, icon: TrendingUp, gradient: "from-green-500 to-teal-500" }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
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
        </div> */}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Hours */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-teal-50 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Weekly Hours Distribution</h2>
                  <p className="text-slate-500 text-sm">Hours tracked per team member this week</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                Real-time
              </div>
            </div>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Task Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Task Status Overview</h2>
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

        {/* Status Legend */}
       {distribution.length > 0 && (
  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/60">
    <div className="flex items-center space-x-3 mb-6">
      <CheckCircle className="w-6 h-6 text-slate-700" />
      <h3 className="text-xl font-bold text-slate-900">Status Breakdown</h3>
    </div>

    {/* 3 Equal Cards Per Row */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {distribution.map((item) => (
        <div
          key={item.status}
          className="flex flex-col items-center justify-center text-center p-5 bg-slate-50 rounded-2xl 
                     shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Colored Dot */}
          <div
            className="w-5 h-5 rounded-full mb-3 transition-transform duration-200"
            style={{
              backgroundColor: statusColors[item.status] || "#64748B",
              boxShadow: `0 4px 12px ${(statusColors[item.status] || "#64748B")}40`,
            }}
          />

          {/* Status */}
          <p className="text-sm font-semibold text-slate-700 capitalize mb-1">
            {item.status.toLowerCase().replace('_', ' ')}
          </p>

          {/* Count */}
          <p className="text-3xl font-bold text-slate-900 mb-1">
            {item._count}
          </p>

          {/* Percentage */}
          <p className="text-sm font-medium text-slate-500">
            {totalTasks > 0 ? ((item._count / totalTasks) * 100).toFixed(1) : 0}%
          </p>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div>
  );
}
