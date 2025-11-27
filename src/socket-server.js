// src/socket-server.js
const { createServer } = require("http");
const { Server } = require("socket.io");
const { registerSocket } = require("./lib/socketServer.js");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

registerSocket(io);

io.on("connection", (socket) => {
  console.log("🔥 Client Connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("⚡ Socket running at http://localhost:3001");
});