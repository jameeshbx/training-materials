import { timeEntryController } from "@/controller/userController";

export const GET = timeEntryController.findAllEntry;
export const POST = timeEntryController.createEntry;
