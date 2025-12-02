import { prisma } from "@/lib/prisma";

export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  details,
  ip,
  userAgent,
}: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ip,
        userAgent,
      },
    });
  } catch (err) {
    console.log("audit error:", err);
  }
}