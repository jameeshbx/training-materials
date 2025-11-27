// src/lib/socketServer.js
let io = null;

function registerSocket(serverInstance) {
  io = serverInstance;
  console.log("✅ Socket Server Ready");
}

function emitEvent(event, data) {
  if (!io) {
    console.log("❌ Socket not initialized");
    return;
  }

  console.log("📡 Emitting:", event, data);
  io.emit(event, data);
}

module.exports = { registerSocket, emitEvent };