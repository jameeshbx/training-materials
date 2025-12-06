import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Helmet-style Security Headers Function
 */
function applySecurityHeaders(response: NextResponse, req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const hostname = req.nextUrl.hostname;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // ✅ Basic Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // ✅ HTTPS Enforcement (Production)
  if (!isDevelopment) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  // ✅ Content Security Policy (CSP)
  // Socket.IO WebSocket
  let connectSrc = "'self'";
  
  // Development Socket.IO allow
  if (isDevelopment) {
    connectSrc += " ws://localhost:* wss://localhost:*";
  }
  
  // Production
  if (!isDevelopment && hostname) {
    connectSrc += ` wss://${hostname}`;
  }

  const cspDirectives = [
    // Basic directives
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js needs unsafe-eval for dev
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    
    // Additional for Next.js
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
  ];

  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  );

  // ✅ Additional security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // ✅ Remove server info
  response.headers.set('X-Powered-By', '');
  response.headers.set('Server', '');

  return response;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  console.log("🔥 TOKEN =>", token, " | PATH =>", pathname);

  // ✅ Socket.IO, API, static files  headers skip 
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('/socket.io/') ||
    pathname.includes('.') // Files with extensions
  ) {
    // Minimal headers for these routes
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  // 1️⃣ Allow invite acceptance without login
  if (pathname.startsWith("/dashboard/") && pathname.split('/').length === 3) {
    const potentialToken = pathname.split('/')[2];
    // Allow if it looks like a token (not a normal dashboard page)
    if (potentialToken && potentialToken.length > 10) {
      const response = NextResponse.next();
      return applySecurityHeaders(response, req);
    }
  }

  // 2️⃣ Not logged in → protect dashboard (except invite tokens)
  if (!token && pathname.startsWith("/dashboard")) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    return applySecurityHeaders(response, req);
  }

  // 3️⃣ Rest of your middleware rules...
  if (!token && pathname.startsWith("/admin")) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    return applySecurityHeaders(response, req);
  }

  if (token && token.role === "USER" && pathname.startsWith("/admin")) {
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    return applySecurityHeaders(response, req);
  }

  if (token && (pathname === "/login" || pathname === "/signup")) {
    const redirectUrl = token.role === "ADMIN" ? "/admin" : "/dashboard";
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));
    return applySecurityHeaders(response, req);
  }

  // ✅ Apply security headers to all normal page requests
  const response = NextResponse.next();
  return applySecurityHeaders(response, req);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/signup",

    // ✅ DO NOT block API routes, Socket.IO, static files
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};