// tests/integration/task.get.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET } from "@/app/api/tasks/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

function createGetRequest(url: string) {
  return new Request(url, {
    method: "GET",
  }) as any;
}

describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("🔐 returns 401 if not authenticated", async () => {
    (auth as any).mockResolvedValue(null);

    const req = createGetRequest("http://localhost/api/tasks");

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("✅ returns tasks with pagination", async () => {
    (auth as any).mockResolvedValue({
      user: { id: 1, email: "user@test.com" },
    });

    const mockTasks = [
      {
        id: 1,
        title: "Task 1",
        description: "Desc",
        status: "pending",
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        user: { id: 1, name: "Test User", email: "user@test.com" },
      },
    ];

    // 👇 👇 Replace this part
    (prisma.task.findMany as any).mockResolvedValue(mockTasks);
    (prisma.task.count as any).mockResolvedValue(1);

    const req = createGetRequest(
      "http://localhost/api/task?page=1&limit=10&search=&date=all"
    );

    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data[0].title).toBe("Task 1");
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.total).toBe(1);
  });
});
