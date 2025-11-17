import { authServices } from "@/services/authService";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const authController = {
  signup: async (req: Request) => {
    try {
      const { name, email, password } = await req.json();
      const user = await authServices.signup({ name, email, password });

      return NextResponse.json(
        { message: "Signup successful", user },
        { status: 200 }
      );
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  },

  login: async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const user = await authServices.login({ email, password });

    
const cookieStore = await cookies();

      cookieStore.set("usertoken", user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });


     return NextResponse.json({
        success: true,
        message: "Login successful",
       
      });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
,

  logout: async () => {
    const response = NextResponse.json({ message: "Logout successful" });

    response.cookies.set("usertoken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  },
};
