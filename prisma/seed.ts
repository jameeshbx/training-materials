import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting simple seed...");

  // Clear database
  await prisma.timeEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  // 1. Create Team
  const team = await prisma.team.create({
    data: {
      name: "Developers",
    },
  });

  console.log("✔ Team created:", team.name);

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
      teamId: team.id,
    },
  });

  console.log("✔ User created:", user.name);

  // 3. Create Task
  const task = await prisma.task.create({
    data: {
      title: "Build Homepage",
      description: "Create main UI layout",
      status: "in-progress",
      teamId: team.id,
      userId: user.id,
    },
  });

  console.log("✔ Task created:", task.title);

  // 4. Create TimeEntry
  const timeEntry = await prisma.timeEntry.create({
    data: {
      hours: 3.5,
      taskId: task.id,
      userId: user.id,   // 🟢 REQUIRED NOW
      startedAt: new Date(),
    },
  });

  console.log("✔ Time entry added:", timeEntry.hours, "hours");

  console.log("🎉 Simple seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
