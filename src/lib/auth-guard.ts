// lib/auth-guard.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return { ok: false, status: 401 as const, reason: "Unauthorized" };
  }

  // @ts-ignore
  if (session.user.role !== "ADMIN") {
    return { ok: false, status: 403 as const, reason: "Forbidden - Admin only" };
  }

  return { ok: true, session };
}
