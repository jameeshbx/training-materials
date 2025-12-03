import { POST, PATCH, GET } from "@/app/api/time-entries/route";

/* =============================================
   MOCKS
============================================= */

// 1️⃣ Mock next-auth/next (this is the REAL one used)
jest.mock("next-auth/next", () => ({
    getServerSession: jest.fn(),
}));

// 2️⃣ Mock next-auth (not used but safe to mock)
jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}));

// 3️⃣ Mock authOptions
jest.mock("@/app/api/auth/[...nextauth]/route", () => ({
    authOptions: {},
}));

// 4️⃣ Mock Prisma
jest.mock("@/lib/db", () => ({
    prisma: {
        timeEntry: {
            findFirst: jest.fn(),
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

/* =============================================
   TESTS
============================================= */

//
// ========== 1️⃣ POST (Start Timer) ==========
//

// Unauthenticated POST
test("POST /api/time-entries returns 401 when not authenticated", async () => {
    const { getServerSession } = require("next-auth/next");
    getServerSession.mockResolvedValue(null);

    const req = new Request("http://localhost/api/time-entries", {
        method: "POST",
        body: JSON.stringify({ taskId: "task1" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
});

// Prevent multiple timers running
test("POST /api/time-entries returns 400 if timer already running", async () => {
    const { getServerSession } = require("next-auth/next");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    prisma.timeEntry.findFirst.mockResolvedValue({
        id: "entry123",
        userId: "user123",
        endAt: null,
    });

    const req = new Request("http://localhost/api/time-entries", {
        method: "POST",
        body: JSON.stringify({ taskId: "task1" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Timer already running");
});

// Successful start timer
test("POST /api/time-entries starts timer successfully", async () => {
    const { getServerSession } = require("next-auth/next");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    prisma.timeEntry.findFirst.mockResolvedValue(null);

    prisma.timeEntry.create.mockResolvedValue({
        id: "entryXYZ",
        userId: "user123",
        taskId: "task1",
        startAt: new Date(),
        endAt: null,
    });

    const req = new Request("http://localhost/api/time-entries", {
        method: "POST",
        body: JSON.stringify({ taskId: "task1" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.id).toBe("entryXYZ");
});


//
// ========== 2️⃣ PATCH (Stop Timer) ==========
//

// Unauthenticated PATCH
test("PATCH /api/time-entries returns 401 when not authenticated", async () => {
    const { getServerSession } = require("next-auth/next");
    getServerSession.mockResolvedValue(null);

    const req = new Request("http://localhost/api/time-entries", {
        method: "PATCH",
        body: JSON.stringify({ id: "entry1" }),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Not authenticated");
});

// Missing ID
test("PATCH /api/time-entries returns 400 if ID is missing", async () => {
    const { getServerSession } = require("next-auth/next");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    const req = new Request("http://localhost/api/time-entries", {
        method: "PATCH",
        body: JSON.stringify({}),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("TimeEntry ID is required");
});

// Entry not found
test("PATCH /api/time-entries returns 404 when entry does not exist", async () => {
    const { getServerSession } = require("next-auth/next");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    prisma.timeEntry.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/time-entries", {
        method: "PATCH",
        body: JSON.stringify({ id: "entry1" }),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe("Not found");
});

// Forbidden (user not owner)
test("PATCH /api/time-entries returns 403 for different user", async () => {
    const { getServerSession } = require("next-auth/next");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    prisma.timeEntry.findUnique.mockResolvedValue({
        id: "entry1",
        userId: "otherUser",
        startAt: new Date(),
        endAt: null,
    });

    const req = new Request("http://localhost/api/time-entries", {
        method: "PATCH",
        body: JSON.stringify({ id: "entry1" }),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Forbidden");
});

// Successful stop timer
test("PATCH /api/time-entries stops timer successfully", async () => {
    const { getServerSession } = require("next-auth/next");
    const { prisma } = require("@/lib/db");

    getServerSession.mockResolvedValue({
        user: { id: "user123" },
    });

    prisma.timeEntry.findUnique.mockResolvedValue({
        id: "entry1",
        userId: "user123",
        startAt: new Date(Date.now() - 60000), // 1 min ago
        endAt: null,
    });

    prisma.timeEntry.update.mockResolvedValue({
        id: "entry1",
        endAt: new Date(),
        duration: 1,
    });

    const req = new Request("http://localhost/api/time-entries", {
        method: "PATCH",
        body: JSON.stringify({ id: "entry1" }),
    });

    const res = await PATCH(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.id).toBe("entry1");
    expect(json.duration).toBe(1);
});
