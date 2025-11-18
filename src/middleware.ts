import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userToken = req.cookies.get("usertoken")?.value;
  const adminToken = req.cookies.get("admintoken")?.value;
  const currentUser = req.cookies.get("current_user")?.value;
  const path = req.nextUrl.pathname;

  // Protect admin
  if (path.startsWith("/admin")) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect user dashboard
  if (path.startsWith("/dashboard")) {
    // Admin should not see user pages
    if (adminToken) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (!userToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }


  if (path === "/login") {
    if (adminToken) return NextResponse.redirect(new URL("/admin", req.url));
    if (userToken) return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/dashboard/:path*",
    "/dashboard",
    "/login",
  ],
};