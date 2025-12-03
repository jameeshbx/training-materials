import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("cn()", () => {
  it("merges class names correctly", () => {
    const result = cn("p-2", "text-sm", "p-4");
    expect(result).toBe("text-sm p-4");
  });

  it("handles conditional classes", () => {
    const result = cn("bg-red", false && "hidden", "text-white");
    expect(result).toBe("bg-red text-white");
  });
});
