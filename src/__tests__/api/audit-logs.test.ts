import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/audit-logs/route";
import { prisma } from "@/lib/prisma";

// =============================
// Mock Prisma
// =============================
vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("GET /api/admin/audit-logs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =============================
  // SUCCESS CASE
  // =============================
  it("returns paginated audit logs successfully", async () => {
    const mockLogs = [
      {
        id: "1",
        action: "CREATE",
        user: { name: "Alice", email: "alice@test.com" },
        createdAt: "2025-12-02T10:38:30.730Z",
      },
      {
        id: "2",
        action: "UPDATE",
        user: { name: "Bob", email: "bob@test.com" },
        createdAt: "2025-12-02T10:38:30.731Z",
      },
    ];

    // Mock Prisma responses
    (prisma.auditLog.findMany as any).mockResolvedValue(mockLogs);
    (prisma.auditLog.count as any).mockResolvedValue(mockLogs.length);

    const req = new NextRequest(
      "http://localhost/api/admin/audit-logs?page=1&limit=10"
    );

    const res = await GET(req);
    const json = await res.json();

    // Ensure Prisma was called with correct query
    expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    expect(prisma.auditLog.count).toHaveBeenCalled();

    // Validate API response
    expect(json).toEqual({
      success: true,
      data: mockLogs,
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    });
  });

  // =============================
  // ERROR CASE
  // =============================
  it("returns server error if prisma fails", async () => {
    (prisma.auditLog.findMany as any).mockRejectedValue(new Error("DB Error"));

    const req = new NextRequest("http://localhost/api/admin/audit-logs");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ success: false, error: "Server error" });
  });
});
