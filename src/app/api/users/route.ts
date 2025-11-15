
import { userController } from "@/controller/userController";

export const GET = userController.findAll;
export const POST = userController.create;
