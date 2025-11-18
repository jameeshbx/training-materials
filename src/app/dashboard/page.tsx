"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    const cookieString = document.cookie;
    const isUser = cookieString.includes("usertoken=");

    if (!isUser) {
      router.replace("/login");
    }
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">120</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">45</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">₹12,500</p>
        </CardContent>
      </Card>
    </div>
  );
}
