import { taskController } from "@/controller/userController";

export const GET = taskController.findAllTask;
export const POST = taskController.createTask;
