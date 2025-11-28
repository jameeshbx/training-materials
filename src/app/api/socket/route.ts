// import { NextRequest } from "next/server";
// import { Server } from "socket.io";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// let connectedUsers: Record<string, any> = {};

// const ioHandler = (req: NextRequest) => {
//   if (!(global as any).io) {

//     const io = new Server(3001, {
//       cors: { origin: "*" },
//     });

//     console.log("🟢 Socket server started on :3001");
//     (global as any).io = io;

//     io.on("connection", (socket) => {
//       console.log("🟢 User connected:", socket.id);

//       // IDENTIFY USER AFTER LOGIN
//       socket.on("identify", async (user) => {
//         connectedUsers[socket.id] = user;

//         socket.data.userId = user.id;
//         socket.data.userName = user.name;

//         console.log("🔵 User identified:", user);

//         // Save login in DB
//         await prisma.activity.create({
//           data: {
//             userId: user.id,
//             userName: user.name,
//             action: "Logged In",
//             details: null,
//           },
//         });

//         io.emit("Logged In", user);
//       });

//       // TASK CREATED
//       socket.on("taskCreated", async (task) => {
//         await prisma.activity.create({
//           data: {
//             userId: task.userId,
//             userName: task.userName,
//             action: "Task Created",
//             details: task.title,  // ⭐ Save task name
//           },
//         });

//         io.emit("taskCreated", task);
//       });

//       // TIMER STARTED
//       socket.on("timerStarted", async (entry) => {
//         await prisma.activity.create({
//           data: {
//             userId: entry.userId,
//             userName: entry.userName,
//             action: "Timer Started",
//             details: entry.taskTitle,
//           },
//         });

//         io.emit("timerStarted", entry);
//       });

//       // TIMER STOPPED
//       socket.on("timerStopped", async (entry) => {
//         await prisma.activity.create({
//           data: {
//             userId: entry.userId,
//             userName: entry.userName,
//             action: "Timer Stopped",
//             details: entry.taskTitle,
//           },
//         });

//         io.emit("timerStopped", entry);
//       });

//       // REAL LOGOUT (USER CLICKED LOGOUT BUTTON)
//       socket.on("logout", async (user) => {
//         console.log("🔴 REAL LOGOUT:", user);

//         await prisma.activity.create({
//           data: {
//             userId: user.id,
//             userName: user.name,
//             action: "Logged Out",
//             details: null,
//           },
//         });

//         io.emit("Logged Out", user);
//       });

//       // DO NOT SEND LOGOUT ON DISCONNECT
//       socket.on("disconnect", () => {
//         console.log("⚠ User disconnected", socket.id);

//         delete connectedUsers[socket.id];
//         // NO logout event here
//       });
//     });

//   }

//   return new Response("Socket server running");
// };

// export { ioHandler as GET, ioHandler as POST };
