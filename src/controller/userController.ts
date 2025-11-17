import { NextResponse } from "next/server";
import { createUser, getUsers } from "../services/userService";
import { timeEntryService } from "@/services/userService";

import { taskService } from "@/services/userService";
import { teamService } from "@/services/userService";


export const userController = {

  // CREATE USER
  create: async (req: Request) => {
    try {
      const body = await req.json();
      const user = await createUser(body);

      return NextResponse.json(
        { message: "User created successfully", user },
        { status: 201 }
      );

    } catch (error: any) {
      console.error("Controller Error: createUser:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  },

  // GET ALL USERS
  findAll: async () => {
    try {
      const users = await getUsers();
      return NextResponse.json(users, { status: 200 });

    } catch (error: any) {
      console.error("Controller Error: getUsers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  },

};

export const teamController = {
  createTeam: async (req: Request) => {
    try {
      const body = await req.json();
      const team = await teamService.createTeam(body);
      return NextResponse.json({ message: "Team Created", team }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  },

  findAllteams: async () => {
    try {
      const teams = await teamService.getTeams();
      return NextResponse.json(teams);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  },
};



export const taskController = {
  createTask: async (req: Request) => {
    try {
      const body = await req.json();
      const task = await taskService.createTask(body);
      return NextResponse.json({ message: "Task Created", task }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  },

  findAllTask: async () => {
    try {
      const tasks = await taskService.getTasks();
      return NextResponse.json(tasks);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  },
};

export const timeEntryController = {
  createEntry: async (req: Request) => {
    try {
      const body = await req.json();
      const entry = await timeEntryService.createTimeEntry(body);
      return NextResponse.json({ message: "Time Entry Added", entry }, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  },

  findAllEntry: async () => {
    try {
      const entries = await timeEntryService.getTimeEntries();
      return NextResponse.json(entries);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  },
};

