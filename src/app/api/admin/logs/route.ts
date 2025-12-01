// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized" },
//       { status: 403 }
//     );
//   }

//   const logs = await prisma.auditLog.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 200,
//   });

//   return NextResponse.json({ success: true, logs });
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
