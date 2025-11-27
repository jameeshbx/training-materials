import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().optional(), // Prisma default = "pending"
  teamId: z.string().optional(),
  dueDate: z.string().optional(), 
  // userId is NOT in schema - it comes from session for security
});

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  teamId: z.string().optional(),
  dueDate: z.string().optional(), 
});
