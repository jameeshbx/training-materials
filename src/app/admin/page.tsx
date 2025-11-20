import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClient";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  

  return <AdminClientPage session={session} />;
}
