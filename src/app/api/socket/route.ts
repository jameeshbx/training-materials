import { initSocket } from "@/socket-server.ts";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(global as any)._socketStarted) {
    const server = require("http").createServer();
    initSocket(server);
    server.listen(3001, () => console.log("🚀 Socket running via Next.js"));
    (global as any)._socketStarted = true;
  }

  return new Response("Socket Ready");
}
