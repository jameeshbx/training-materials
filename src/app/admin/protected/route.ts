import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 403 });
  }

  return Response.json({ message: "Admin API Access Granted" });
}
