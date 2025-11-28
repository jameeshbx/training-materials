// server.js - Custom Next.js server with Socket.IO
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Create Next.js app
const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  // Don't use express.json() globally - it interferes with Next.js API routes
  // Only apply JSON parsing to Express-specific routes

  const server = createServer(app);

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // allow all frontend origins
      methods: ["GET", "POST"],
    },
  });

  // Make io instance available globally for API routes
  global.io = io;

  // SOCKET.IO CONNECTION HANDLER
  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);
    console.log(`📊 Total connected clients: ${io.sockets.sockets.size}`);

    // Join team room if teamId is provided
    socket.on("joinTeam", (teamId) => {
      if (teamId) {
        socket.join(`team:${teamId}`);
        console.log(`👤 User ${socket.id} joined team:${teamId}`);
        const room = io.sockets.adapter.rooms.get(`team:${teamId}`);
        console.log(`👥 Users in team:${teamId}: ${room ? room.size : 0}`);
      }
    });

    // Leave team room
    socket.on("leaveTeam", (teamId) => {
      if (teamId) {
        socket.leave(`team:${teamId}`);
        console.log(`👤 User ${socket.id} left team:${teamId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
      console.log(`📊 Total connected clients: ${io.sockets.sockets.size}`);
    });
  });

  // API ENDPOINT for emit event from backend
  // Apply JSON body parser only to this Express route
  app.post("/emit", express.json(), (req, res) => {
    try {
      const { event, activity, teamId } = req.body;
      
      console.log("📥 Express /emit endpoint called:", { event, activity, teamId });
      console.log(`📊 Connected clients: ${io.sockets.sockets.size}`);
      
      if (event === "activity" && activity) {
        // Always emit to all clients (for visibility across teams)
        console.log("📢 Emitting activity to ALL clients:", activity);
        io.emit("activity", activity);
        
        // Also emit to specific team room if teamId exists (for team-specific filtering)
        if (teamId) {
          const room = io.sockets.adapter.rooms.get(`team:${teamId}`);
          console.log(`📢 Also emitting to team room: team:${teamId} (${room ? room.size : 0} users)`);
          io.to(`team:${teamId}`).emit("activity", activity);
        }
        
        console.log("✅ Activity emitted successfully via Express /emit");
      } else {
        // Legacy support for other events
        io.emit(event, req.body.task || req.body);
      }
      
      return res.json({ success: true, clients: io.sockets.sockets.size });
    } catch (error) {
      console.error("❌ Error in Express /emit endpoint:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // Handle all other routes with Next.js
  // Use a catch-all that works with Express 5.x
  app.use((req, res) => {
    return handle(req, res);
  });

  // START SERVER
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready on http://${hostname}:${port}`);
    console.log(`🟢 Socket.IO ready on http://${hostname}:${port}`);
  });
});
