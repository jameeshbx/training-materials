import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File;

        if (!title || !file) {
            return NextResponse.json(
                { error: "Title and file are required" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);


        const uploaded: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "documents" }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                })
                .end(buffer);
        });



        const saved = await prisma.fileUpload.create({
            data: {
                title,
                description,
                url: uploaded.secure_url,
                thumbnailUrl: uploaded.secure_url.replace(
                    "/upload/",
                    "/upload/w_300,h_300,c_fill/"
                ),
                fileName: file.name,
                mimeType: file.type,
                size: file.size,
            },
        });

        return NextResponse.json(saved);
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 500 });
    }
}

export async function GET() {
    const files = await prisma.fileUpload.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
}
