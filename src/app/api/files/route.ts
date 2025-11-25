import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// CREATE
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileNameFromForm = formData.get("fileName");

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "attachments" }, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        })
        .end(buffer);
    });

    const fileUrl = uploadResult.secure_url as string;
    const fileType = (file as any).type ?? "application/octet-stream";
    const fileName =
      (fileNameFromForm as string | null) ?? (file as any).name ?? "file";

    const created = await prisma.attachment.create({
      data: { fileName, fileUrl, fileType },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during create";
    return NextResponse.json(
      { error: "Failed to create file", detail: message },
      { status: 500 }
    );
  }
}

// READ ALL
export async function GET() {
  try {
    const files = await prisma.attachment.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.attachment.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during delete";
    return NextResponse.json(
      { error: "Failed to delete file", detail: message },
      { status: 500 }
    );
  }
}
