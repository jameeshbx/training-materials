import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Helmet-Style Security Headers
 */
function withHeaders(res: NextResponse) {
  // Prevent Clickjacking
  res.headers.set("X-Frame-Options", "DENY");

  // Disable MIME sniffing
  res.headers.set("X-Content-Type-Options", "nosniff");

  // Hide referrer info
  res.headers.set("Referrer-Policy", "no-referrer");

  // Restrict browser permissions
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Enforce HTTPS
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content Security Policy (self only)
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  return res;
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // -------------- Auth Check ----------------
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // No session → protect dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return withHeaders(
      NextResponse.redirect(new URL("/login", req.nextUrl))
    );
  }

  // No session → protect admin
  if (!token && pathname.startsWith("/admin")) {
    return withHeaders(
      NextResponse.redirect(new URL("/login", req.nextUrl))
    );
  }

  // Already logged-in → block /login page
  if (token && pathname === "/login") {
    return withHeaders(
      NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    );
  }

  // Allow everything else
  return withHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
  ],
};
