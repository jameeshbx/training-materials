import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    logger.info("📁 File upload request received");

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            logger.warn("Unauthorized upload attempt");
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        logger.info("Form data parsed successfully");

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File;

        if (!title || !file) {
            logger.warn("Missing title or file in upload request");
            return NextResponse.json(
                { error: "Title and file are required" },
                { status: 400 }
            );
        }

        logger.info({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            userId: session.user.id
        }, "File metadata received");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        logger.info("File converted to buffer");

        logger.info("Uploading file to Cloudinary...");
        const uploaded: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "documents" }, (err, result) => {
                    if (err) {
                        logger.error({ err }, "Cloudinary upload failed");
                        reject(err);
                    } else {
                        logger.info("Cloudinary upload successful");
                        resolve(result);
                    }
                })
                .end(buffer);
        });

        logger.info("Saving file metadata to database...");
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
                userId: session.user.id,
            },
        });

        // ✅ FIXED line
        logger.info({ fileId: saved.id }, "File saved to database successfully");

        return NextResponse.json(saved);
    } catch (err) {
        logger.error({ err }, "Unexpected error during file upload");
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function GET() {
    logger.info("📄 Fetching user's uploaded files");

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        logger.warn("Anonymous user tried to fetch files");
        return NextResponse.json([], { status: 200 });
    }

    const files = await prisma.fileUpload.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    logger.info({ count: files.length }, "Files fetched successfully");

    return NextResponse.json(files);
}


