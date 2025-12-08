import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TaskPageClient from "./TaskPageClient";

export default async function TaskPage() {
  const session = await getServerSession(authOptions);

  return <TaskPageClient isAuth={!!session} />;
}
