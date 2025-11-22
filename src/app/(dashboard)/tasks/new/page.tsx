import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateTaskForm from "./CreateTaskForm";

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-red-500">Not authenticated</p>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

      <CreateTaskForm userId={session.user.id} />
    </div>
  );
}
