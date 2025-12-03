import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { auth } from "@/auth"; 

import { emitEvent } from "@/lib/socketServer";  
// 🔹 New notification create (toast pole message save)
export async function POST(req: Request) {

  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();

  if (!message) {
    return NextResponse.json(
      { message: "Message is required" },
      { status: 400 }
    );
  }

  const notification = await prisma.notification.create({
    data: {
      message,
      userId: Number(session.user.id),
    },
  });

  // 🚀 Real-time broadcast to frontend
  emitEvent("notification", notification);

  return NextResponse.json(notification, { status: 201 });
}
// 🔹 Current user-inte notifications list
export async function GET() {
  const session = await await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications, { status: 200 });
}
