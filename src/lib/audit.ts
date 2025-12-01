import { db } from "./db";

interface LogOptions {
  action: string;
  userId?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  userName?: string | null;
  meta?: any;
}

export async function logAction(options: LogOptions) {
  const { action, userId, targetType, targetId, meta, userName } = options;

  try {
    // If userId is provided but userName is not, fetch the user name from the database
    let finalUserName = userName;
    if (userId && !userName) {
      try {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });
        finalUserName = user?.name || null;
      } catch (userError) {
        console.error("Failed to fetch user name for audit log:", userError);
      }
    }

    await db.auditLog.create({
      data: {
        action,
        userId: userId || null,
        targetType: targetType || null,
        targetId: targetId || null,
        meta: meta ?? undefined,
        userName: finalUserName || null,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
