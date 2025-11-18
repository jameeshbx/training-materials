import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role:string
}

export interface loginData {
    email:string,
    password:string
}

export const authServices={
    signup:async(data:RegisterData)=>{
          try {
          const { name, email, password,role } = data;
          const existingUser =await prisma.user.findUnique({
            where:{email}
          })
          if(existingUser){
            throw new Error("User already exists with this email")
          }
          const hashpassword=await bcrypt.hash(password,10)

          const createUser=await prisma.user.create({
            data:{
                name,
                email,
                password:hashpassword,
                role:"USER"
            }
          })

          return { message:"Signup successful",createUser}
    
    } catch (error: any) {
      console.error("Signup Service Error:", error);
      throw new Error(error.message || "Something went wrong during signup");
    }
},


login:async(data:loginData)=>{
    try {
        const{email,password}=data
        const findemail=await prisma.user.findUnique({
            where:{email}
        })
        if(!findemail)
        {
            throw new Error("invalid email or password")
        }
        const passwordMatch=await bcrypt.compare(password,findemail.password)
        if(!passwordMatch){
            throw new Error("invalid email or password")
        }
         const secret = process.env.JWT_SECRET as string;
        const token=jwt.sign({id:findemail.id,role:findemail.role},secret,{expiresIn:"10d"})
        return {message:"login success full",token,findemail}
        
    }  catch (error: any) {
      console.error("Signup Service Error:", error);
      throw new Error(error.message || "Something went wrong during signup");
    }
}
}