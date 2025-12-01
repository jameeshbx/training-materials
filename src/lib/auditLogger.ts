import {prisma} from "./db"; // adjust path based on your project

export async function logAction({
    userId = null,
    action,
    entityType = null,
    entityId = null,
    details = null,
    ipAddress = null,
}) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entityType,
                entityId,
                details,
                ipAddress,
            },
        });
    } catch (err) {
        console.error("Audit Log Error:", err);
    }
}
