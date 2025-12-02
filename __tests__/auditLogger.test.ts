/**
 * @jest-environment node
 */

import { logAction } from "../src/lib/auditLogger";
import { prisma } from "../src/lib/db";

// 1️⃣ Mock the prisma.auditLog.create function
jest.mock("../src/lib/db", () => ({
    prisma: {
        auditLog: {
            create: jest.fn(),
        },
    },
}));

describe("logAction", () => {
    test("should call prisma.auditLog.create with correct data", async () => {
        await logAction({
            userId: 1,
            action: "TEST_ACTION",
            entityType: "TASK",
            entityId: 101,
            details: "This is a test",
            ipAddress: "127.0.0.1",
        });

        expect(prisma.auditLog.create).toHaveBeenCalledWith({
            data: {
                userId: 1,
                action: "TEST_ACTION",
                entityType: "TASK",
                entityId: 101,
                details: "This is a test",
                ipAddress: "127.0.0.1",
            },
        });
    });
});
