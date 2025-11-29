"use client";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type ReportsChartsProps = {
  barData: any;
  doughnutData: any;
};

export function ReportsCharts({ barData, doughnutData }: ReportsChartsProps) {

  // Chart color palette
  const colors = ["#4F46E5", "#06B6D4", "#F97316", "#16A34A", "#DC2626", "#D946EF"];

  // Update dataset colors
  const coloredBarData = {
    ...barData,
    datasets: barData.datasets.map((dataset: any) => ({
      ...dataset,
      backgroundColor: colors,
      borderRadius: 8,
    })),
  };

  const coloredDoughnutData = {
    ...doughnutData,
    datasets: doughnutData.datasets.map((dataset: any) => ({
      ...dataset,
      backgroundColor: colors,
      borderWidth: 2,
      hoverOffset: 10,
    })),
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="border rounded-xl p-4 shadow bg-white">
        <h2 className="font-semibold text-black mb-2">Weekly Hours per Member</h2>
        <Bar data={coloredBarData} />
      </div>

      <div className="border rounded-xl p-4 shadow bg-white">
        <h2 className="font-semibold text-black  mb-2">Task Distribution</h2>
        <Doughnut data={coloredDoughnutData} />
      </div>
    </div>
  );
}
