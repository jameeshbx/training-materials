import type { Server as HTTPServer } from "http";
import type { Server as IOServer } from "socket.io";

declare global {
  // These are set in server.js
  // global.server = httpServer;
  // global.io = io;
  // We declare them as optional because they may not exist in all runtimes.
  // eslint-disable-next-line no-var
  var server: HTTPServer | undefined;
  // eslint-disable-next-line no-var
  var io: IOServer | undefined;
}

export {};
