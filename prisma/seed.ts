import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a team first (optional but recommended)
  const team = await prisma.team.create({
    data: {
      name: "Engineering Team",
    },
  });

  // Create a user and connect to the team
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      team: {
        connect: { id: team.id }, // connect the user to the team
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
