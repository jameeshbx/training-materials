import { POST, PUT, DELETE, GET } from "@/app/api/tasks/route";

/* =============================================
   MOCKS
============================================= */

// 1️⃣ Mock next-auth session handling
jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}));

// 2️⃣ Mock authOptions (avoid running NextAuth)
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({
    authOptions: {},
}));

// 3️⃣ Mock Prisma
jest.mock("@/lib/db", () => ({
    prisma: {
        $transaction: jest.fn((operations) => {
            // Execute all mocked operations and return results as an array
            return Promise.all(operations);
        }),
        task: {
            create: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
        timeEntry: {
            deleteMany: jest.fn(),
        },
        activity: {
            create: jest.fn(),
        },
    },
}));


// 4️⃣ Mock emitActivity (socket)
jest.mock("@/lib/emitActivity", () => ({
    emitActivity: jest.fn(),
}));

// 5️⃣ Mock logAction (audit logs)
jest.mock("@/lib/auditLogger", () => ({
    logAction: jest.fn(),
}));


/* =============================================
   TESTS
============================================= */

/* ---------------------------
   1️⃣ POST (Create Task)
--------------------------- */

// Unauthenticated
test("POST /api/tasks returns 401 when not authenticated", async () => {
    const { getServerSession } = require("next-auth");
    getServerSession.mockResolvedValue(null);

    const req = new Request("http://localhost/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "Test Task" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
});

// Authenticated
test("POST /api/tasks creates task when authenticated", async () => {
    const { getServerSession } = require("next-auth");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123", name: "Test User" },
    });

    prisma.task.create.mockResolvedValue({
        id: "task123",
        title: "New Task",
        description: "",
        assigneeId: "user123",
    });

    prisma.activity.create.mockResolvedValue({
        id: "act1",
        message: "Created a new task",
        userName: "Test User",
        createdAt: new Date(),
    });

    const req = new Request("http://localhost/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "New Task" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.task.id).toBe("task123");
    expect(json.task.title).toBe("New Task");
});


/* ---------------------------
   2️⃣ PUT (Update Task)
--------------------------- */

// Unauthenticated
test("PUT /api/tasks returns 401 when not authenticated", async () => {
    const { getServerSession } = require("next-auth");
    getServerSession.mockResolvedValue(null);

    const req = new Request("http://localhost/api/tasks", {
        method: "PUT",
        body: JSON.stringify({ id: "task1", title: "Updated" }),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
});

// Authenticated update
test("PUT /api/tasks updates task when authenticated", async () => {
    const { getServerSession } = require("next-auth");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    // Mock existing task
    prisma.task.findFirst.mockResolvedValue({
        id: "task123",
        title: "Old Task",
        assigneeId: "user123",
    });

    // Mock update
    prisma.task.update.mockResolvedValue({
        id: "task123",
        title: "Updated Task",
    });

    const req = new Request("http://localhost/api/tasks", {
        method: "PUT",
        body: JSON.stringify({ id: "task123", title: "Updated Task" }),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.task.title).toBe("Updated Task");
});


/* ---------------------------
   3️⃣ DELETE (Delete Task)
--------------------------- */

// Unauthenticated
test("DELETE /api/tasks returns 401 when not authenticated", async () => {
    const { getServerSession } = require("next-auth");
    getServerSession.mockResolvedValue(null);

    const req = new Request("http://localhost/api/tasks?id=task123", {
        method: "DELETE",
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
});

// Authenticated delete
test("DELETE /api/tasks deletes task when authenticated", async () => {
    const { getServerSession } = require("next-auth");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    // Mock existing task
    prisma.task.findFirst.mockResolvedValue({
        id: "task123",
        title: "Task To Delete",
        assigneeId: "user123",
    });

    // Mock deleteMany for time entries
    prisma.timeEntry.deleteMany.mockResolvedValue({ count: 1 });

    // Mock delete task
    prisma.task.delete.mockResolvedValue({
        id: "task123",
        title: "Task To Delete",
    });

    const req = new Request("http://localhost/api/tasks?id=task123", {
        method: "DELETE",
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Task deleted");
    expect(json.task.id).toBe("task123");
});

test("GET /api/tasks returns 401 when not authenticated", async () => {
    const { getServerSession } = require("next-auth");
    getServerSession.mockResolvedValue(null);

    const req = new Request("http://localhost/api/tasks?search=&page=1&limit=10", {
        method: "GET",
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
});

// Authenticated GET
test("GET /api/tasks returns tasks list when authenticated", async () => {
    const { getServerSession } = require("next-auth");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    prisma.task.findMany.mockResolvedValue([
        {
            id: "task1",
            title: "Test Task 1",
            description: "",
            assigneeId: "user123",
            timeEntries: [],
        },
    ]);

    prisma.task.count.mockResolvedValue(1);

    const req = new Request("http://localhost/api/tasks?search=&page=1&limit=10", {
        method: "GET",
    });

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.tasks.length).toBe(1);
    expect(json.pagination.total).toBe(1);
    expect(json.pagination.page).toBe(1);
});
