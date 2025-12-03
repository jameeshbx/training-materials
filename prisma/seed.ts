import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a team
  const team = await prisma.team.create({
    data: {
      name: "Engineering Team",
    },
  });

  // Create a user WITH ROLE + connect to the team
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "securepassword123", // (Hash in production only)
      role: Role.ADMIN,               // 👈 Added for today’s task
      team: {
        connect: { id: team.id },
      },
    },
  });

  console.log("User created:", user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
