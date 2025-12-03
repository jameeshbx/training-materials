import { describe, it, expect } from "vitest";
import { getRequestMeta } from "../lib/request-meta";

describe("getRequestMeta()", () => {
  it("returns correct IP and user-agent from headers", () => {
    const req = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "123.45.67.89",
        "user-agent": "Mozilla/5.0",
      },
    });

    const meta = getRequestMeta(req);

    expect(meta.ip).toBe("123.45.67.89");
    expect(meta.userAgent).toBe("Mozilla/5.0");
  });

  it("returns null when headers are missing", () => {
    const req = new Request("http://localhost");

    const meta = getRequestMeta(req);

    expect(meta.ip).toBeNull();
    expect(meta.userAgent).toBeNull();
  });
});
