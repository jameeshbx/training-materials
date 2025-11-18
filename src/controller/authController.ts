import { authServices } from "@/services/authService";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const authController = {
  signup: async (req: Request) => {
    try {
      const { name, email, password,role } = await req.json();
      const user = await authServices.signup({ name, email, password,role });

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
console.log(user);

    const response = NextResponse.json({
      success: true,
      role: user.findemail.role,
      message: "Login successful",
    });

    // Clear both tokens first (important fix)
    response.cookies.set("usertoken", "", { path: "/", expires: new Date(0) });
    response.cookies.set("admintoken", "", { path: "/", expires: new Date(0) });

    if (user.findemail.role === "ADMIN") {
      response.cookies.set("admintoken", user.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    } else {
      response.cookies.set("usertoken", user.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return response;

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
