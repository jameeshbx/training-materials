import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
// import { prisma } from "@/lib/db"; // optional DB check

export const runtime = "nodejs";  // Ensure Node.js runtime
export const dynamic = "force-dynamic";  // Prevent edge optimization

export async function GET() {
    const start = Date.now();

    try {
        // Optional database check (enable if needed)
        // await prisma.$queryRaw`SELECT 1`;

        const uptime = process.uptime();

        const payload = {
            status: "ok",
            uptime,
            timestamp: new Date().toISOString(),
            responseTimeMs: Date.now() - start,
            // db: "ok", // enable this if DB check is used
        };

        logger.info(payload, "Health check executed");

        return NextResponse.json(payload);
    } catch (err) {
        logger.error(err, "Health check failed");

        return NextResponse.json(
            {
                status: "error",
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
