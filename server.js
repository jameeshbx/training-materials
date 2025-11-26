// server.js (root directory-ൽ create cheyyu)
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Socket.IO setup
  const io = new Server(server, {
    path: "/api/socket/io",
    cors: {
      origin: dev ? "http://localhost:3000" : process.env.NEXTAUTH_URL,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('🔥 Client connected:', socket.id);
    
    socket.on('taskCreated', (task) => {
      socket.broadcast.emit('taskCreated', task);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});