import { prisma } from "@/lib/prisma";
import { AuditLog } from "@prisma/client";

type CreateAuditLogParams = {
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  details?: any;
  ip?: string;
  userAgent?: string;
  level?: 'info' | 'warn' | 'error';
};

export async function createAuditLog({
  actorId,
  actorEmail,
  actorRole,
  action,
  resource,
  resourceId,
  details,
  ip,
  userAgent,
  level = 'info',
}: CreateAuditLogParams): Promise<AuditLog | null> {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId,
        actorEmail,
        actorRole,
        action,
        resource,
        resourceId,
        details,
        ip,
        userAgent,
        level,
      },
    });
  } catch (err) {
    console.error("Audit log creation failed:", err);
    return null;
  }
}