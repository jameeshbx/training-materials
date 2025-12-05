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
  if (pathname.startsWith("/dashboard/") && pathname.split("/").length === 3) {
    const potentialToken = pathname.split("/")[2];
    if (potentialToken && potentialToken.length > 10) {
      const res = NextResponse.next();
      addSecurityHeaders(res);
      return res;
    }
  }

  // 2️⃣ Not logged in → protect dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    addSecurityHeaders(res);
    return res;
  }

  // 3️⃣ Protect /admin
  if (!token && pathname.startsWith("/admin")) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    addSecurityHeaders(res);
    return res;
  }

  // USER cannot access admin
  if (token && token.role === "USER" && pathname.startsWith("/admin")) {
    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    addSecurityHeaders(res);
    return res;
  }

  // Logged-in users cannot visit login/signup
  if (token && (pathname === "/login" || pathname === "/signup")) {
    const redirectTo = token.role === "ADMIN" ? "/admin" : "/dashboard";
    const res = NextResponse.redirect(new URL(redirectTo, req.url));
    addSecurityHeaders(res);
    return res;
  }

  // Default response
  const res = NextResponse.next();
  addSecurityHeaders(res);
  return res;
}

/* -------------------------------------------------------
    3️⃣ STEP — HELMET-LIKE SECURITY HEADERS
--------------------------------------------------------- */
function addSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("X-XSS-Protection", "1; mode=block"); // legacy but OK for task
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    // "/login",
    // "/signup",
    // "/((?!api).*)", // do NOT apply to API routes
  ],
};
