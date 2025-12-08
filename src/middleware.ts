import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// Define your supported locales
const locales = ['en', 'ml']; // Add more as needed

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): { locale: string | null, cleanPath: string } {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length > 0 && locales.includes(segments[0])) {
    return {
      locale: segments[0],
      cleanPath: '/' + segments.slice(1).join('/') || '/'
    };
  }
  
  return { locale: null, cleanPath: pathname };
}

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
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
  ];

  response.headers.set(
    'Content-Security-Policy',
    cspDirectives.join('; ')
  );

  // ✅ Additional security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Powered-By', '');
  response.headers.set('Server', '');

  return response;
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const pathname = req.nextUrl.pathname;
  
  // Extract locale and clean path
  const { locale, cleanPath } = getLocaleFromPath(pathname);
  
  console.log("🔥 PATH:", pathname, "| LOCALE:", locale, "| CLEAN PATH:", cleanPath, "| TOKEN:", !!token);

  // ✅ Skip for API, static files, monitoring
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('/socket.io/') ||
    pathname.includes('.') ||
    pathname.includes('monitoring') // Skip Sentry monitoring
  ) {
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  // 1️⃣ Handle locale redirection
  if (!locale && pathname === '/') {
    // Redirect root to default locale
    const defaultLocale = 'en';
    const newUrl = new URL(`/${defaultLocale}`, req.url);
    const response = NextResponse.redirect(newUrl);
    return applySecurityHeaders(response, req);
  }

  // 2️⃣ Validate locale
  if (locale && !locales.includes(locale)) {
    // Invalid locale, redirect to default
    const newUrl = new URL(`/en${cleanPath}`, req.url);
    const response = NextResponse.redirect(newUrl);
    return applySecurityHeaders(response, req);
  }

  // Helper function to create URLs with locale
  const createUrl = (path: string) => {
    const basePath = path.startsWith('/') ? path : `/${path}`;
    if (locale) {
      return new URL(`/${locale}${basePath}`, req.url);
    }
    return new URL(basePath, req.url);
  };

  // 3️⃣ Allow invite acceptance without login
  if (cleanPath.startsWith("/dashboard/") && cleanPath.split('/').length === 3) {
    const potentialToken = cleanPath.split('/')[2];
    if (potentialToken && potentialToken.length > 10) {
      const response = NextResponse.next();
      return applySecurityHeaders(response, req);
    }
  }

  // 4️⃣ Not logged in → protect dashboard (except invite tokens)
  if (!token && cleanPath.startsWith("/dashboard")) {
    const loginUrl = createUrl("/login");
    const response = NextResponse.redirect(loginUrl);
    return applySecurityHeaders(response, req);
  }

  // 5️⃣ Not logged in → protect admin
  if (!token && cleanPath.startsWith("/admin")) {
    const loginUrl = createUrl("/login");
    const response = NextResponse.redirect(loginUrl);
    return applySecurityHeaders(response, req);
  }

  // 6️⃣ User trying to access admin → redirect to dashboard
  if (token && token.role === "USER" && cleanPath.startsWith("/admin")) {
    const dashboardUrl = createUrl("/dashboard");
    const response = NextResponse.redirect(dashboardUrl);
    return applySecurityHeaders(response, req);
  }

  // 7️⃣ Already logged in → redirect from login/signup
  if (token && (cleanPath === "/login" || cleanPath === "/signup")) {
    const redirectUrl = token.role === "ADMIN" ? "/admin" : "/dashboard";
    const targetUrl = createUrl(redirectUrl);
    const response = NextResponse.redirect(targetUrl);
    return applySecurityHeaders(response, req);
  }

  // ✅ Apply security headers to all normal page requests
  const response = NextResponse.next();
  return applySecurityHeaders(response, req);
}

export const config = {
  matcher: [
    // Match all paths except static files and API
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml|robots.txt|monitoring).*)",
  ],
};