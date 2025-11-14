"use client"
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Teammembers } from '@/types/user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function Teams() {


const members: Teammembers[] = [
    {
      id: 1,
      name: "Eldhose",
      designation: "Software Engineer",
      avatar: "https://github.com/shadcn.png"
    },
     {
      id: 2,
      name: "Gokul",
      designation: "Software Engineer",
      avatar: "https://github.com/shadcn.png"
    },
     {
      id: 3,
      name: "Anirva",
      designation: "Software Engineer",
      avatar: "https://github.com/shadcn.png"
    },
    {
      id: 4,
      name: "Asiwarya",
      designation: "Software Engineer",
      avatar: "https://github.com/shadcn.png"
    },
  ];







  return (
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {members.map((member) => (
        <Card key={member.id} className="shadow-xl">
          <CardHeader>
            <Avatar>
              <AvatarImage src={member.avatar} />
              <AvatarFallback>{member.name.slice(0,2)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-md mt-2">Name:{member.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-600">{member.designation}</p>
          </CardContent>
        </Card>
      ))}      
    </div>
  )
}
