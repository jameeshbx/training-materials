import { prisma } from "@/lib/prisma";

type CreateUserData = {
  name: string;
  email: string;
};

export type CreateTeamdata = {
  name: string;
}

export const createUser = async (data: CreateUserData) => {
  try {
    const { name, email } = data;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error("Email already exists");
    }

    // Create user
    const addUser = await prisma.user.create({
      data: { name, email },
    });

    return addUser;

  } catch (error: any) {
    console.error("Service Error: createUser:", error);
    throw new Error(error.message || "User creation failed");
  }
};

export const getUsers = async () => {
  try {
    

  
    const findUser = await prisma.user.findMany();

    return findUser;

  } catch (error: any) {
    console.error("Service Error: createUser:", error);
    throw new Error(error.message || "User creation failed");
  }
};


export const teamService = {
  // Create Team
  createTeam: async (data: CreateTeamdata) => {
    try {
      return await prisma.team.create({ data });
    } catch (error: any) {
      console.error("Service Error(createTeam):", error);
      throw new Error(error.message || "Team creation failed");
    }
  },

  // Get Teams
  getTeams: async () => {
    try {
      const findTeam = await prisma.team.findMany();
      return findTeam;
    } catch (error: any) {
      console.error("Service Error(getTeams):", error);
      throw new Error(error.message || "Fetching teams failed");
    }
  }
};

export type CreateTaskDTO = {
  title: string;
  description?: string;
  userId: number;
  teamId: number;
};



export const taskService = {
  createTask: async (data: CreateTaskDTO) => {
    try {
         const { title, description, userId, teamId } = data;
     return await prisma.task.create({
  data: {
    title,
    description,
    user: { connect: { id: userId } },
    team: { connect: { id: teamId } }
  }
});

    } catch (error: any) {
      throw new Error(error.message || "Task creation failed");
    }
  },

  getTasks: async () => {
    try {
      return await prisma.task.findMany(
       
      );
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch tasks");
    }
  },
};

export type CreateTimeEntryDTO = {
  userId: number;
  taskId: number;
  duration: number;
};

export const timeEntryService = {
  createTimeEntry: async (data: CreateTimeEntryDTO) => {
    try {
          const { duration, userId, taskId } = data;
       return await prisma.timeEntry.create({
        data: {
          duration,
          user: { connect: { id: userId } },
          task: { connect: { id: taskId } },
        },
      });
    } catch (error: any) {
      throw new Error(error.message || "Time entry creation failed");
    }
  },

  getTimeEntries: async () => {
    try {
      return await prisma.timeEntry.findMany();
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch time entries");
    }
  },
};

