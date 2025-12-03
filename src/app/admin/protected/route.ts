import { auth } from "@/auth"; 

export async function GET(req: Request) {
  const session = await await auth();

  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 403 });
  }

  return Response.json({ message: "Admin API Access Granted" });
}
