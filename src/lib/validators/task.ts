import { z } from "zod";

export const CreateTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    completed: z.boolean().optional(),
    teamId: z.string().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
});

export const UpdateTaskSchema = z.object({
    id: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    completed: z.boolean().optional(),
    teamId: z.string().optional().nullable(),
    assigneeId: z.string().optional().nullable(),
});
