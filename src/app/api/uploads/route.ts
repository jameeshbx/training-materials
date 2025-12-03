import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
import { auth } from "@/auth"; 
import { z } from "zod";

const fileUploadSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized — Please login" },
        { status: 401 }
      );
    }

    const json = await req.json();
    const result = fileUploadSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, url } = result.data;
const userId = Number(session.user.id);

    const saved = await prisma.fileUpload.create({
      data: {
        name,
        url,
        userId: userId
      },
    });

    return NextResponse.json({ success: true, file: saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error saving file" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const files = await prisma.fileUpload.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(files);
}



export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: "❌ Invalid or missing ID" },
        { status: 400 }
      );
    }

    // Delete database record
    await prisma.fileUpload.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      success: true,
      message: "✔️ File deleted successfully",
    });

  } catch (error: any) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

