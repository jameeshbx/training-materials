import { NextRequest } from "next/server";
import { Server } from "socket.io";

const ioHandler = (req: NextRequest) => {
  if (!(global as any).io) {
    const io = new Server(3001, {
      cors: {
        origin: "*",
      },
    });

    (global as any).io = io;

    io.on("connection", (socket) => {
      console.log("🟢 User connected:", socket.id);
    });
  }

  return new Response("Socket server running");
};

export { ioHandler as GET, ioHandler as POST };
