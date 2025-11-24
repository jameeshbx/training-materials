import {NextResponse} from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
    try {
         const finduser=await prisma.user.findMany({
        where:{
            role:"USER"
        }
    })
   return NextResponse.json({
  success: true,
  users: finduser
});
    } catch (error:any) {
        return NextResponse.json(
      { message: "Error fetching time entries", error: error.message },
      { status: 500 }
    );
    }
   
}