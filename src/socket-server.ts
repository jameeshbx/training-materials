import { Server } from "socket.io";

declare global {
  var _io: Server | undefined;
}

export const initSocket = (server: any) => {
  if (!global._io) {
    global._io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });

    global._io.on("connection", (socket) => {
      console.log("⚡ Client connected:", socket.id);
    });

    console.log("🟢 Socket server initialized");
  }

  return global._io;
};
