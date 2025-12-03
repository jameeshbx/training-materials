import { CreateTaskSchema, UpdateTaskSchema } from "../src/lib/validators/task";

describe("CreateTaskSchema", () => {
    test("should validate a valid task", () => {
        const data = {
            title: "Test Task",
            description: "Some description",
            status: "open",
            dueDate: "2024-12-01",
            completed: false,
            teamId: "123",
            assigneeId: "456",
        };

        const result = CreateTaskSchema.safeParse(data);

        expect(result.success).toBe(true);
    });

    test("should fail when title is missing", () => {
        const data = { description: "Missing title" };

        const result = CreateTaskSchema.safeParse(data);

        expect(result.success).toBe(false);
    });
});

describe("UpdateTaskSchema", () => {
    test("should validate a valid update", () => {
        const data = { id: "123", title: "Updated Title" };

        const result = UpdateTaskSchema.safeParse(data);

        expect(result.success).toBe(true);
    });

    test("should fail when id is missing", () => {
        const data = { title: "No ID" };

        const result = UpdateTaskSchema.safeParse(data);

        expect(result.success).toBe(false);
    });
});
