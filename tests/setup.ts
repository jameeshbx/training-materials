// tests/setup.ts
import { vi } from "vitest";

// ✅ next-auth mock (default + getServerSession)
vi.mock("next-auth", () => {
  return {
    __esModule: true,
    default: vi.fn(),          // NextAuth()
    getServerSession: vi.fn(), // tests mockResolvedValue set 
  };
});

// ✅ prisma mock – Task related methods  mock 
vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// ✅ socket.io event emit mock
vi.mock("@/lib/socketServer.ts", () => ({
  emitEvent: vi.fn(),
}));

// ✅ audit log mock
vi.mock("@/lib/audit", () => ({
  createAuditLog: vi.fn().mockResolvedValue(undefined),
}));

// ✅ request meta mock
vi.mock("@/lib/request-meta", () => ({
  getRequestMeta: () => ({
    ip: "127.0.0.1",
    userAgent: "vitest-test",
  }),
}));
