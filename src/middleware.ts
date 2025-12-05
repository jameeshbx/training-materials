import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { limit } from "./lib/rateLimiter";



const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-DNS-Prefetch-Control": "on",
};

// Rate limiter is imported from ./lib/rateLimiter

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // 🔒 Apply Rate Limiter FIRST for /api/auth routes (BEFORE any other checks)
    if (pathname.startsWith("/api/auth")) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown";

      const result = limit(ip);
      if (!result.success) {
        console.log(`🚫 Rate limit exceeded for IP: ${ip} (${result.count} requests)`);
        const response = new NextResponse(
          JSON.stringify({ 
            error: "Too many requests",
            message: "Rate limit exceeded. Maximum 5 requests per minute. Please try again later."
          }),
          { 
            status: 429, 
            headers: { 
              "Content-Type": "application/json",
              "X-RateLimit-Limit": "5",
              "X-RateLimit-Remaining": result.remaining.toString(),
              "X-RateLimit-Reset": result.reset.toString(),
              // Prevent NextAuth from trying to redirect
              "Cache-Control": "no-store, no-cache, must-revalidate",
            } 
          }
        );
        // Add security headers even to error responses
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      }
      // Rate limit passed, continue with normal flow
    }

    // Skip other API routes (let them pass through)
    if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
      const response = NextResponse.next();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // 🔐 Block non-admin users from /admin
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        const response = NextResponse.redirect(new URL("/unauthorized", req.nextUrl.origin));
        Object.entries(securityHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      }
    }

    // Add security headers to response
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access only if logged in
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: [
    // Protect dashboard and app routes
    "/dashboard/:path*",
    "/tasks/:path*",
    "/reports/:path*",
    "/teams/:path*",
    "/admin/:path*",
    "/documents/:path*",
    // Include /api/auth/* to apply rate limiting
    "/api/auth/:path*",
  ],
};