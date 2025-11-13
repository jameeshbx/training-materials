// src/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCard{
  id:number;
  title:string;
  description:string;
  imageUrl:string;
     
}



export interface Teammembers{
  id:number;
  name:string;
  designation:string;
  avatar?: string;
}

export interface Tasks{
  id:number;
  task:string;
  desc:string;

}