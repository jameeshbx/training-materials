// lib/auth-guard.ts
import { auth } from "@/auth"; 

export async function requireAdmin() {
  const session = await auth()

  if (!session || !session.user?.id) {
    return { ok: false, status: 401 as const, reason: "Unauthorized" };
  }

  // @ts-ignore
  if (session.user.role !== "ADMIN") {
    return { ok: false, status: 403 as const, reason: "Forbidden - Admin only" };
  }

  return { ok: true, session };
}
