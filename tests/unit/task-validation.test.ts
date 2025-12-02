import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema } from "../../src/lib/validations/task";

describe("Task Validation Schema", () => {
  it("should pass for valid create task input", () => {
    const data = {
      title: "Real Task",
      description: "Unit test task",
      status: "pending",
      teamId: "team123",
      dueDate: "2025-12-01",
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it("should fail when title is missing", () => {
    const data = {
      title: "",
      description: "Missing title test"
    };

    const result = createTaskSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it("should allow partial update in updateTaskSchema", () => {
    const data = {
      status: "completed"
    };

    const result = updateTaskSchema.safeParse(data);

    expect(result.success).toBe(true);
  });
});
