import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
console.log("user created.........")
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Protect ADMIN creation (optional)
    // 👉 Only allow admin creation if you manually pass ?admin-secret=XXX
    const isAdminRequest = role === "ADMIN";

   

    // Create user with role
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: isAdminRequest ? Role.ADMIN : Role.USER,
      },
    });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
