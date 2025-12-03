import { describe, it, expect, vi } from "vitest";
import { POST } from "../../src/app/api/tasks/route";
import { NextRequest } from "next/server";

// 1. Mock DB
vi.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn().mockResolvedValue({
        name: "Test User",
        teamId: "team123",
      }),
    },
    task: {
      create: vi.fn().mockResolvedValue({
        id: "test123",
        title: "Task from Test",
        description: "Created during integration test",
        status: "pending",
        userId: "user123",
      }),
    },
    activity: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

// 2. Mock Auth
vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({
    user: { id: "user123", name: "Test User", role: "USER" },
  }),
}));

// 3. Mock logAction only
vi.mock("@/lib/audit", () => ({
  logAction: vi.fn(),
}));

// 4. Ignore socket emit
vi.mock("@/lib/socket", () => ({
  emitActivity: vi.fn(),
}));

describe("POST /api/tasks - Real Integration Test", () => {
  it("creates a task successfully", async () => {
    const body = {
      title: "Task from Test",
      description: "Created during integration test",
    };

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toHaveProperty("id");
    expect(json.title).toBe("Task from Test");
  });
});
