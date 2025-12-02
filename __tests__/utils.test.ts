import { cn } from "../src/lib/utils";

describe("cn utility function", () => {
    test("should merge class names correctly", () => {
        const result = cn("text-red-500", "font-bold");
        expect(result).toBe("text-red-500 font-bold");
    });

    test("should handle conditional classes", () => {
        const isActive = true;

        const result = cn("btn", isActive && "btn-active");
        expect(result).toBe("btn btn-active");
    });

    test("should remove duplicate Tailwind classes", () => {
        const result = cn("p-2", "p-4"); // tailwind-merge keeps only the latest
        expect(result).toBe("p-4");
    });
});
