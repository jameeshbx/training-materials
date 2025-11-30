// import { getToken } from "next-auth/jwt";
// import { NextResponse, NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const { pathname } = req.nextUrl;

//   const isAdminPath = pathname.startsWith("/admin");
//   const isUserPath =
//     pathname.startsWith("/dashboard") || pathname.startsWith("/user");

//   if (!token && (isAdminPath || isUserPath)) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (token && token.role === "USER" && isAdminPath) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (token && token.role === "ADMIN" && isUserPath) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (pathname === "/" && token) {
//     return NextResponse.redirect(
//       new URL(token.role === "ADMIN" ? "/admin" : "/dashboard", req.url)
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*", "/dashboard/:path*", "/user/:path*"],
// };

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  console.log("🔥 TOKEN =>", token, " | PATH =>", pathname);

  // 1️⃣ Allow invite acceptance without login
  if (pathname.startsWith("/dashboard/") && pathname.split('/').length === 3) {
    const potentialToken = pathname.split('/')[2];
    // Allow if it looks like a token (not a normal dashboard page)
    if (potentialToken && potentialToken.length > 10) {
      return NextResponse.next();
    }
  }

  // 2️⃣ Not logged in → protect dashboard (except invite tokens)
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3️⃣ Rest of your middleware rules...
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && token.role === "USER" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(
      new URL(token.role === "ADMIN" ? "/admin" : "/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     "/dashboard",
//     "/dashboard/:path*",
//     "/admin",
//     "/admin/:path*",
//     "/login",
//     "/signup",
//   ],
// };

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",

    // ❌ DO NOT block API routes
    "/((?!api).*)",
  ],
};