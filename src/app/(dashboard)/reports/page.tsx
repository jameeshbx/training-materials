// export const revalidate = 60;





// import { db } from "@/lib/db";
// import { ReportsCharts } from "@/components/reports/ReportsCharts";

// export default async function ReportsPage() {
//   const now = new Date();
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(now.getDate() - 7);

//   const hoursPerUser = await db.timeEntry.groupBy({
//     by: ["userId"],
//     where: {
//       createdAt: { gte: sevenDaysAgo, lte: now },
//     },
//     _sum: {
//       hours: true,
//     },
//   });

//   const users = await db.user.findMany({
//     where: { id: { in: hoursPerUser.map((r) => r.userId) } },
//     select: { id: true, name: true },
//   });

//   const userNameMap = Object.fromEntries(users.map((u) => [u.id, u.name]));

//   const barData = {
//     labels: hoursPerUser.map((row) => userNameMap[row.userId] || "Unknown"),
//     datasets: [
//       {
//         label: "Hours this week",
//         data: hoursPerUser.map((row) => row._sum.hours || 0),
//       },
//     ],
//   };


//   // 🔥 TASK DISTRIBUTION (hours per task, per user)
// const taskDistribution = await db.timeEntry.groupBy({
//   by: ["taskId", "userId"],
//   _sum: { hours: true },
// });

// // Format for chart: Task name + User name
// const taskDetails = await Promise.all(
//   taskDistribution.map(async (row) => {
//     const task = await db.task.findUnique({ where: { id: row.taskId } });
//     const user = await db.user.findUnique({ where: { id: row.userId } });

//     return {
//       label: `${task?.title} (${user?.name})`,
//       hours: row._sum.hours || 0,
//     };
//   })
// );

// // Final doughnut chart data
// const doughnutData = {
//   labels: taskDetails.map((item) => item.label),
//   datasets: [
//     {
//       data: taskDetails.map((item) => item.hours),
//       backgroundColor: ["#6366F1", "#06B6D4", "#F59E0B", "#10B981", "#EF4444"],
//     },
//   ],
// };


//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-bold">Reports</h1>
//       <ReportsCharts barData={barData} doughnutData={doughnutData} />
//     </div>
//   );
// }


import { ReportsCharts } from "@/components/reports/ReportsCharts";
import { db } from "@/lib/db";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";


export const dynamic = "force-dynamic";
export const revalidate = 60;

async function getReports() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const res = await fetch(`${baseUrl}/api/reports`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function ReportsPage() {
 const t = await getTranslations("ReportsPage");

  const tasks = await db.task.findMany({
    select: { id: true, title: true },
  });

  const { reports, taskDistribution } = await getReports();

  const users = await db.user.findMany({
    select: { id: true, name: true },
  });

  const userNameMap = Object.fromEntries(
    users.map((u) => [u.id, u.name])
  );

  const barData = {
    labels: reports.map((r: any) => userNameMap[r.userId] || "Unknown"),
    datasets: [
      {
        label: t("barChartLabel"),
        data: reports.map((r: any) => r._sum.hours || 0),
        backgroundColor: "#6366F1",
      },
    ],
  };

  const doughnutData = {
    labels: taskDistribution.map((row: any) => {
      const taskName = tasks.find((t) => t.id === row.taskId)?.title || "Unknown";
      const userName = userNameMap[row.userId] || "Unknown";
      return `${taskName} (${userName})`;
    }),
    datasets: [
      {
        data: taskDistribution.map((row: any) => row._sum.hours || 0),
      },
    ],
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t("heading")}</h1>
      <ReportsCharts barData={barData} doughnutData={doughnutData} />
    </div>
  );
}
