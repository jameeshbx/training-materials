import { PrismaClient } from '@prisma/client';

// Reusable Prisma client instance (same as src/lib/prisma.ts)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - for development)
  await prisma.timeEntry.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  // 1. Create a Team
  const team = await prisma.team.create({
    data: {
      name: 'Developers',
    },
  });
  console.log('✅ Created team:', team.name);

  // 2. Create a User in that team (User–Team relation)
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      team: { connect: { id: team.id } },
    },
  });
  console.log('✅ Created user:', user.name, 'in team:', team.name);

  // 3. Create a Task for the user and team (Task–User, Task–Team relations)
  const task = await prisma.task.create({
    data: {
      title: 'Build Homepage',
      description: 'Create hero section UI',
      status: 'in-progress',
      team: { connect: { id: team.id } },
      user: { connect: { id: user.id } },
    },
  });
  console.log('✅ Created task:', task.title, 'for team:', team.name);

  // 4. Add Time Entry to Task (Task–TimeEntry relation)
  const timeEntry = await prisma.timeEntry.create({
    data: {
      hours: 3.5,
      task: { connect: { id: task.id } },
    },
  });
  console.log('✅ Created time entry:', timeEntry.hours, 'hours for task:', task.title);

  // 5. Create additional seed data to demonstrate relations
  const team2 = await prisma.team.create({
    data: {
      name: 'Designers',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      team: { connect: { id: team2.id } },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Design Logo',
      description: 'Create brand identity',
      status: 'pending',
      team: { connect: { id: team2.id } },
      user: { connect: { id: user2.id } },
    },
  });

  await prisma.timeEntry.create({
    data: {
      hours: 2.0,
      task: { connect: { id: task2.id } },
    },
  });

  console.log('✅ Created additional seed data');

  // Verify relations by querying
  const teamWithUsers = await prisma.team.findUnique({
    where: { id: team.id },
    include: {
      users: true,
      tasks: {
        include: {
          timeEntries: true,
        },
      },
    },
  });

  console.log('\n📊 Verification - Team with relations:');
  console.log(`Team: ${teamWithUsers?.name}`);
  console.log(`Users: ${teamWithUsers?.users.length}`);
  console.log(`Tasks: ${teamWithUsers?.tasks.length}`);
  console.log(`Time Entries: ${teamWithUsers?.tasks.reduce((sum, t) => sum + t.timeEntries.length, 0)}`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
