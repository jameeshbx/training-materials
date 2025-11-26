import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const doc = await prisma.fileUpload.findUnique({
        where: { id },
    });

    return NextResponse.json(doc);
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        await prisma.fileUpload.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        console.error("DELETE ERROR:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
