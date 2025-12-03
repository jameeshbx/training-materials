import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { GET, POST, PUT, DELETE } from "@/app/api/tasks/route";
import { NextRequest } from "next/server";

// =============================
// MOCK NEXT-AUTH SESSION (fixed default export)
// =============================
vi.mock("next-auth", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: vi.fn(), // mock default export (NextAuth)
    getServerSession: vi.fn().mockResolvedValue({
      user: { id: "session-user-id" },
    }),
  };
});

// =============================
// MOCK AUDIT & ACTIVITY HELPERS
// =============================
vi.mock("@/lib/audit", () => ({
  createAuditLog: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/activity", () => ({
  createActivity: vi.fn().mockResolvedValue(true),
}));

// =============================
// MOCK global.io
// =============================
(global as any).io = { emit: vi.fn() };

describe("Tasks API", () => {
  let taskId: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: { name: "Test User", email: "test@example.com", password: "Test@123" },
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Clean up tasks and users
    await prisma.task.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =============================
  // POST → Create Task
  // =============================
  it("POST → should create task", async () => {
    const body = JSON.stringify({
      title: "My Task",
      description: "Demo",
      userId,
    });

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "POST",
      body,
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.data.title).toBe("My Task");
    expect(json.data.userId).toBe(userId);

    taskId = json.data.id;
  });

  // =============================
  // PUT → Update Task
  // =============================
  it("PUT → should update task", async () => {
    const body = JSON.stringify({
      id: taskId,
      status: "completed",
    });

    const req = new NextRequest("http://localhost/api/tasks", {
      method: "PUT",
      body,
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.status).toBe("completed");
  });

  // =============================
  // DELETE → Delete Task
  // =============================
  it("DELETE → should delete the task", async () => {
    const req = new NextRequest(`http://localhost/api/tasks?id=${taskId}`, {
      method: "DELETE",
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
