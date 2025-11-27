import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emitActivity } from "@/lib/socket";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { url, title, fileName } = body;

    // create DB record
    const document = await db.document.create({
      data: {
        url,
        title,
        fileName,
      },
    });

    // Realtime activity emit
    await emitActivity({
      type: "documentUploaded",
      userId,
      userName: session?.user?.name || "Unknown User",
      teamId: (session?.user as any)?.teamId || null,
      documentName: fileName,
    });

    return NextResponse.json({ success: true, document });

  } catch (error) {
    console.error("❌ Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    await db.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
