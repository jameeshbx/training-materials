io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("identify", (user) => {
    socket.userId = user.id;
    socket.userName = user.name;

    console.log("User identified:", user);

    io.emit("userLoggedIn", user);
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      io.emit("userLoggedOut", {
        id: socket.userId,
        name: socket.userName,
      });
    }
  });
});