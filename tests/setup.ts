import { vi } from "vitest";

// ✅ Correct mock for your actual auth import
vi.mock("@/auth", () => {
  return {
    auth: vi.fn(),      // mock auth() used in API routes
    signIn: vi.fn(),
    signOut: vi.fn(),
  };
});

// Prisma mock
vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// socket mock
vi.mock("@/lib/socketServer.ts", () => ({
  emitEvent: vi.fn(),
}));

// audit mock
vi.mock("@/lib/audit", () => ({
  createAuditLog: vi.fn().mockResolvedValue(undefined),
}));

// request meta mock
vi.mock("@/lib/request-meta", () => ({
  getRequestMeta: () => ({
    ip: "127.0.0.1",
    userAgent: "vitest-test",
  }),
}));
