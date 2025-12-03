// tests/integration/task.post.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/tasks/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

function createJsonRequest(url: string, method: string, body: any) {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }) as any;
}

describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("✅ creates task for valid data", async () => {
    (getServerSession as any).mockResolvedValue({
      user: { id: 1, email: "user@test.com" },
    });

    const mockTask = {
      id: 123,
      title: "My Test Task",
      description: "Some desc",
      status: "pending",
      dueDate: null,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { name: "Test User" },
    };

    (prisma.task.create as any).mockResolvedValue(mockTask);

    const req = createJsonRequest(
      "http://localhost/api/tasks",
      "POST",
      {
        title: "My Test Task",
        description: "Some desc",
      }
    );

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("My Test Task");
    expect(data.data.user.name).toBe("Test User");

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          title: "My Test Task",
          description: "Some desc",
          status: "pending",
          user: { connect: { id: 1 } },
        }),
        include: {
          user: { select: { name: true } },
        },
      })
    );
  });
});
