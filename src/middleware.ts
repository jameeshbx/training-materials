import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isUserPath =
    pathname.startsWith("/dashboard") || pathname.startsWith("/user");

  if (!token && (isAdminPath || isUserPath)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && token.role === "USER" && isAdminPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && token.role === "ADMIN" && isUserPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/" && token) {
    return NextResponse.redirect(
      new URL(token.role === "ADMIN" ? "/admin" : "/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/user/:path*"],
};
