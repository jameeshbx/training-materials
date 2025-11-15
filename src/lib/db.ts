import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Use existing PrismaClient in dev mode (prevents hot-reload issues)
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query", "info", "warn", "error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
