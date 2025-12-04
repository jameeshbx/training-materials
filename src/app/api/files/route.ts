
import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logger } from "@/lib/logger";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";



export async function POST(req: Request) {
    logger.info("📁 File upload request received");  // <-- Log request received

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            logger.warn("Unauthorized upload attempt"); // <-- Log unauthorized
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        logger.info("Form data parsed successfully"); // <-- Log parsed formData

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File;

        if (!title || !file) {
            logger.warn("Missing title or file in upload request"); // <-- Missing fields
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
        }, "File metadata received");  // <-- File metadata log

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        logger.info("File converted to buffer"); // <-- Buffer conversion log

        // Upload to Cloudinary
        logger.info("Uploading file to Cloudinary..."); // <-- Cloudinary upload start
        const uploaded: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "documents" }, (err, result) => {
                    if (err) {
                        logger.error({ err }, "Cloudinary upload failed"); // <-- Cloudinary error
                        reject(err);
                    } else {
                        logger.info("Cloudinary upload successful"); // <-- Cloudinary success
                        resolve(result);
                    }
                })
                .end(buffer);
        });

        // Save file record in DB
        logger.info("Saving file metadata to database..."); // <-- DB save start
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

        logger.info("File saved to database successfully", { fileId: saved.id }); // <-- DB success

        return NextResponse.json(saved);
    } catch (err) {
        logger.error({ err }, "Unexpected error during file upload"); // <-- Error log
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}



export async function GET() {

    logger.info("📄 Fetching user's uploaded files"); // <-- GET request log

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        logger.warn("Anonymous user tried to fetch files"); // <-- Warn if no user
        return NextResponse.json([], { status: 200 });
    }

    const files = await prisma.fileUpload.findMany({
        where: { userId: session.user.id },    
        orderBy: { createdAt: "desc" },
    });

    logger.info({ count: files.length, userId: session.user.id }, "Files fetched successfully"); // <-- Log count

    return NextResponse.json(files);
}

