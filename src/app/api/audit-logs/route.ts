// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = Number(searchParams.get("page") || 1);
//     const limit = Number(searchParams.get("limit") || 20);
//     const skip = (page - 1) * limit;

//     const logs = await prisma.auditLog.findMany({
//       skip,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//       include: {
//         user: { select: { name: true, email: true } }
//       }
//     });

//     const total = await prisma.auditLog.count();

//     return NextResponse.json({
//       success: true,
//       data: logs,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit)
//       }
//     });

//   } catch (err) {
//     return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    const logs = await prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.auditLog.count();

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}