// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(req: any) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
//   const pathname = req.nextUrl.pathname;

//   console.log(" TOKEN =>", token, " | PATH =>", pathname);

//   // 1️⃣ Allow invite acceptance without login
//   if (pathname.startsWith("/dashboard/") && pathname.split('/').length === 3) {
//     const potentialToken = pathname.split('/')[2];
//     // Allow if it looks like a token (not a normal dashboard page)
//     if (potentialToken && potentialToken.length > 10) {
//      const res = NextResponse.next();
//       addSecurityHeaders(res);
//       return res;
//     }
//   }

//   // 2️⃣ Not logged in → protect dashboard (except invite tokens)
//   if (!token && pathname.startsWith("/dashboard")) {
//      const res = NextResponse.redirect(new URL("/login", req.url));
//     addSecurityHeaders(res);
//     return res;
//   }

//   // 3️⃣ Rest of your middleware rules...
//   if (!token && pathname.startsWith("/admin")) {
// const res = NextResponse.redirect(new URL("/login", req.url));
//     addSecurityHeaders(res);
//     return res;  }

//   if (token && token.role === "USER" && pathname.startsWith("/admin")) {
// const res = NextResponse.redirect(new URL("/dashboard", req.url));
//     addSecurityHeaders(res);
//     return res;  }

//   if (token && (pathname === "/login" || pathname === "/signup")) {
//     const res= NextResponse.redirect(
//       new URL(token.role === "ADMIN" ? "/admin" : "/dashboard", req.url)
//     );
//      addSecurityHeaders(res);
//     return res;
//   }

//   const res= NextResponse.next();
//   addSecurityHeaders(res);
//   return res;
// }

// function addSecurityHeaders(res: NextResponse) {
//   res.headers.set("X-Frame-Options", "DENY");
//   res.headers.set("X-Content-Type-Options", "nosniff");
//   res.headers.set("Referrer-Policy", "no-referrer");
//   res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
//   res.headers.set(
//     "Strict-Transport-Security",
//     "max-age=63072000; includeSubDomains; preload"
//   );
//   res.headers.set(
//     "Content-Security-Policy",
//     "default-src 'self'; script-src 'self'; img-src 'self' data:;"
//   );
// }

// // export const config = {
// //   matcher: [
// //     "/dashboard",
// //     "/dashboard/:path*",
// //     "/admin",
// //     "/admin/:path*",
// //     "/login",
// //     "/signup",
// //   ],
// // };

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/admin/:path*",
//     "/login",
//     "/signup",

//     // ❌ DO NOT block API routes
//     "/((?!api).*)",
//   ],
// };


// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { limit } from "@/lib/rateLimiter";
import type { NextRequest } from "next/server";
import toast from "react-hot-toast";
// --- Client IP helper ---
function getClientIp(req: NextRequest): string {
  // Try various headers in order of preference
  const headers = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "x-remote-addr",
    "x-client-ip",
    "x-cluster-client-ip"
  ];

  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      // Handle comma-separated lists (x-forwarded-for often has multiple IPs)
      const ips = value.split(",").map(ip => ip.trim());
      // Return first valid IP (the original client)
      const validIp = ips.find(ip => 
        ip && 
        ip !== "::1" && 
        ip !== "127.0.0.1" && 
        ip !== "::ffff:127.0.0.1"
      );
      if (validIp) return validIp;
      // Fallback to first IP if no valid ones found
      return ips[0] || "127.0.0.1";
    }
  }

  // Try to get from request socket (for Node.js)
  try {
    // @ts-ignore - This is a Next.js internal property
    const socketIp = req.socket?.remoteAddress;
    if (socketIp && socketIp !== "::1" && socketIp !== "127.0.0.1") {
      return socketIp;
    }
  } catch (error) {
    // Ignore error, fall through
  }

  // Fallback to localhost
  return "127.0.0.1";
}

// --- Rate limiting function ---
function applyRateLimit(req: NextRequest, pathname: string): boolean {
  const ip = getClientIp(req);
  console.log(`Rate limit check for IP: ${ip} on path: ${pathname}`);
  
  const result = limit(ip, 5, 60000); // 5 requests per minute

  if (!result.success) {
    console.log(`Rate limit EXCEEDED for IP: ${ip} - Count: ${result.count}`);
    
  }

  return result.success;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // -------------------------------------------
  // 1) Rate-limit ALL auth API calls (especially login attempts)
  // -------------------------------------------
  if (
    pathname.startsWith("/api/auth") &&
    (pathname.includes("/callback/") || 
     pathname.includes("/signin") ||
     pathname.includes("/login") ||
     pathname === "/api/auth/session")
  ) {
    // Apply rate limit
    const allowed = applyRateLimit(request, pathname);
    
    if (!allowed) {
      return NextResponse.json(
        { 
          error: "Too many requests. Try again later.",
          message: "Rate limit exceeded. Maximum 5 requests per minute."
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': '60',
            'Retry-After': '60'
          }
        }
      );
    }
  }

  // -------------------------------------------
  // 2) Rate-limit login page submissions (POST requests)
  // -------------------------------------------
  if (
    (pathname === "/api/login" || pathname === "/api/auth/login") &&
    method === "POST"
  ) {
    const allowed = applyRateLimit(request, pathname);
    
    if (!allowed) {
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please wait 1 minute."
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      );
    }
  }

  // -------------------------------------------
  // 3) Authentication protection
  // -------------------------------------------
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get the response for modifications
  let response: NextResponse;

  // Unauthed → redirect from protected pages
  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", request.url);
      // Add redirect parameter to know where user came from
      loginUrl.searchParams.set("callbackUrl", pathname);
      response = NextResponse.redirect(loginUrl);
      addSecurityHeaders(response);
      return response;
    }
  } else {
    // Logged-in → redirect away from auth pages
    if (pathname === "/login" || pathname === "/signup") {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
      addSecurityHeaders(response);
      return response;
    }
    
    // Admin role check
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
      addSecurityHeaders(response);
      return response;
    }
  }

  // Normal request - continue
  response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

// --- Helmet-like Headers ---
function addSecurityHeaders(res: NextResponse) {
  // Don't override existing headers, add missing ones
  const headers = new Headers(res.headers);

  // Security headers
  if (!headers.has("X-Frame-Options")) {
    headers.set("X-Frame-Options", "DENY");
  }
  
  if (!headers.has("X-Content-Type-Options")) {
    headers.set("X-Content-Type-Options", "nosniff");
  }
  
  if (!headers.has("Referrer-Policy")) {
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }
  
  if (!headers.has("Permissions-Policy")) {
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  }

  // HSTS for production only
  if (process.env.NODE_ENV === "production" && !headers.has("Strict-Transport-Security")) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // CSP - only if not already set
  if (!headers.has("Content-Security-Policy")) {
    headers.set(
      "Content-Security-Policy",
      `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https:;
        font-src 'self';
        connect-src 'self';
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, " ").trim()
    );
  }

  // Return new response with updated headers
  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: headers,
  });
}

// --- Matcher ---
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. _next/static (static files)
     * 2. _next/image (image optimization files)
     * 3. favicon.ico (favicon file)
     * 4. public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};