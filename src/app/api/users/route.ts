import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";




{/*Create user */}



const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, email } = body;

    const addUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    return NextResponse.json(addUser, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
};


{/*Get all Users */}

export const GET=async()=>{
  try {
    const findAlluser=await prisma.user.findMany()
    console.log(findAlluser)
    return NextResponse.json({succes:true,findAlluser})
  } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });

  }
}