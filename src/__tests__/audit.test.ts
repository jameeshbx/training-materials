import { vi, describe, it, expect } from "vitest";
import { createAuditLog } from "@/lib/audit";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {
      create: vi.fn().mockResolvedValue(true),
    },
  },
}));

describe("createAuditLog()", () => {
  it("creates an audit log entry", async () => {
    await createAuditLog({
      userId: "123",
      action: "TEST",
      entity: "Example",
      entityId: "1",
      details: "This is a test",
      ip: "127.0.0.1",
      userAgent: "Vitest",
    });

    const { prisma } = await import("@/lib/prisma");

    expect(prisma.auditLog.create).toHaveBeenCalledOnce();
  });
});
