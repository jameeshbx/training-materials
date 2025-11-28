
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Next.js app
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// When a client connects
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins their team room
    socket.on("join_team", (teamId) => {
        console.log(`Socket ${socket.id} joined team ${teamId}`);
        socket.join(teamId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Endpoint for emitting activity
app.post("/emit-activity", (req, res) => {
    const { teamId, activity } = req.body;

    if (!teamId || !activity) {
        return res.status(400).json({ error: "teamId and activity required" });
    }

    // Broadcast to all connected users in this team
    io.to(teamId).emit("activity", activity);

    return res.status(200).json({ ok: true });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
