import { auth } from "@/auth"; 
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClient";

export default async function AdminDashboard() {
  const session = await await auth();

  if (!session) redirect("/login");

  

  return <AdminClientPage session={session} />;
}
