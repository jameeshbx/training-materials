import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  console.log("🔥 TOKEN =>", token, " | PATH =>", pathname);

  // 1️⃣ Not logged in → protect admin & dashboard
  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2️⃣ Logged-in USER trying to access admin → block
  if (token && token.role === "USER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3️⃣ Logged-in user/admin cannot visit login or signup again
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(
      new URL(token.role === "ADMIN" ? "/admin" : "/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
