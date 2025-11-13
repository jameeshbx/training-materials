"use client"
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tasks } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function Teams() {


const Task: Tasks[] = [
   {
  id: 1,
  task: "Make Tailwind UI",
  desc: "Create responsive UI components using Tailwind CSS following project design guidelines.",
},
{
  id: 2,
  task: "Make Contact Page",
  desc: "Design and develop a contact form page with input validations and UI styling.",
},
{
  id: 3,
  task: "Fix Server Side Error",
  desc: "Identify and resolve backend server errors to ensure smooth API functionality.",
},

  ];







  return (
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Task.map((task) => (
        <Card key={task.id} className="shadow-xl">
          <CardHeader>
            
            <CardTitle className="text-md mt-2">Task:{task.task}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-600">{task.desc}</p>
          </CardContent>
        </Card>
      ))}      
    </div>
  )
}
