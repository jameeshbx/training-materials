import { prisma } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

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

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploaded: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "documents" }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                })
                .end(buffer);
        });

        // Save file record in DB
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
                userId: session.user.id,   // ⭐ IMPORTANT
            },
        });

        return NextResponse.json(saved);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// =======================
// GET: List only current user's documents
// =======================
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json([], { status: 200 });
    }

    const files = await prisma.fileUpload.findMany({
        where: { userId: session.user.id },    // ⭐ IMPORTANT
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(files);
}

