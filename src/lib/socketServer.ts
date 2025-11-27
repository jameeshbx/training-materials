import { Server } from "socket.io";

declare global {
  // ensures globalThis.io types don’t break TS
  var _io: Server | undefined;
}

export const registerSocket = (server: Server) => {
  if (!global._io) {
    global._io = server;

    global._io.on("connection", (socket) => {
      console.log("🔗 Client Connected:", socket.id);
    });

    console.log("🟢 Socket initialized (GLOBAL)");
  }
};

export const emitEvent = (event: string, data: any) => {
  if (!global._io) {
    return console.log("❌ No Socket Instance Found");
  }

  console.log("📡 Emitting =>", event, data);
  global._io.emit(event, data);
};
