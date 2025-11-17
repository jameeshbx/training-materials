// prisma/seed.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    const user1 = await prisma.user.create({
        data: { name: "Gokul", email: "gokul@example.com" },
    });

    const user2 = await prisma.user.create({
        data: { name: "John Doe", email: "john@example.com" },
    });

    const team = await prisma.team.create({
        data: {
            name: "Development Team",
            members: { connect: [{ id: user1.id }, { id: user2.id }] },
        },
    });

    const task = await prisma.task.create({
        data: {
            title: "Build Dashboard",
            description: "Create UI for dashboard layout",
            assigneeId: user1.id,
            teamId: team.id,
        },
    });

    await prisma.timeEntry.create({
        data: {
            userId: user1.id,
            taskId: task.id,
            start: new Date(),
        },
    });

    console.log("🌱 Seeding complete!");
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
    });
