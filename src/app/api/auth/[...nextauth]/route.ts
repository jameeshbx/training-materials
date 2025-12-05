import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { limit } from "@/lib/rateLimiter";
import { NextRequest, NextResponse } from "next/server";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Wrap handlers with rate limiting
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  return handler(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  // Check if this is a signin request (login attempt)
  const path = req.nextUrl.pathname;
  
  // NextAuth credentials provider uses: /api/auth/callback/credentials
  // Rate limit any POST to callback/credentials (actual login attempts)
  const isSignInAttempt = path.includes("/callback/credentials");
  
  // Log all POST requests to see what we're getting
  console.log(`📨 POST to auth endpoint: ${path}`);
  
  if (isSignInAttempt) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    console.log(`🔍 Rate limiting check for IP: ${ip} on path: ${path}`);

    const result = limit(ip);
    
    if (!result.success) {
      console.log(`🚫 Rate limit exceeded for IP: ${ip} (${result.count} requests in window)`);
      // Return a response that NextAuth can handle without trying to construct URLs
      // Use a plain text response or ensure the JSON doesn't trigger URL parsing
      const response = new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Maximum 5 requests per minute. Please try again later.",
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
          },
        }
      );
      return response;
    }

    console.log(`✅ Rate limit OK for IP: ${ip} (${result.count}/5 requests)`);
  }

  // Call the original NextAuth handler
  return handler(req, context);
}
