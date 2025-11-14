"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";


export default function ReportPage() {
  // Dummy report data
  const reports = [
    {
      id: 1,
      name: "Gokul",
      task: "Make Tailwind UI",
      status: "Completed",
      hours: 5,
      date: "2025-11-01",
    },
    {
      id: 2,
      name: "Anirva",
      task: "Make Contact Page",
      status: "In Progress",
      hours: 3,
      date: "2025-11-03",
    },
    {
      id: 3,
      name: "Eldhose ER",
      task: "Fix Server Error",
      status: "Pending",
      hours: 2,
      date: "2025-11-05",
    },

    {
      id: 4,
      name: "Asiwarya",
      task: "Fix Server Error",
      status: "Pending",
      hours: 2,
      date: "2025-11-05",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{reports.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-green-400">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reports.filter((r) => r.status === "Completed").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {reports.reduce((sum, r) => sum + r.hours, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Task Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.task}</TableCell>
                  <TableCell>
                   <Badge
  variant={
    r.status === "Completed"
      ? "default"
      : r.status === "In Progress"
      ? "secondary"
      : "destructive"
  }
>
  {r.status}
</Badge>

                  </TableCell>
                  <TableCell>{r.hours}</TableCell>
                  <TableCell>{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
