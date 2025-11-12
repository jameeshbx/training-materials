// src/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceCard{
  id:number;
  title:string;
  description:string;
  imageUrl:string;

}