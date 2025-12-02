import { describe, it, expect } from "vitest";
import { timeAgo } from "@/lib/timeAgo";

describe("timeAgo()", () => {
  it("returns just now for current time", () => {
    expect(timeAgo(new Date())).toBe("Just now");
  });
});
