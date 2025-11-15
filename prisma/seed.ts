import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Create a Team
  const team = await prisma.team.create({
    data: {
      name: 'Developers',
    },
  });

  // 2. Create a User in that team
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      team: { connect: { id: team.id } },
    },
  });

  // 3. Create a Task inside that team
  const task = await prisma.task.create({
    data: {
      title: 'Build Homepage',
      description: 'Create hero section UI',
      teamId: team.id,
      userId: user.id,
    },
  });

  // 4. Add Time Entry to Task
  await prisma.timeEntry.create({
    data: {
      hours: 3.5,
      task: { connect: { id: task.id } },
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
