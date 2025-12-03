import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClientPage from "./AdminClient";

// ⛔ Prevent static generation (Fixes build error)
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <AdminClientPage session={session} />;
}
