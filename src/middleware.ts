import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect dashboard paths (add others if needed)
  if (pathname.startsWith("/dashboard")) {
    // NextAuth uses different cookie names depending on secure context:
    // - __Secure-next-auth.session-token (in secure contexts)
    // - next-auth.session-token (fallback)
    const token =
      req.cookies.get("__Secure-next-auth.session-token")?.value ??
      req.cookies.get("next-auth.session-token")?.value;

    // No token => redirect to login
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`;
      return NextResponse.redirect(url);
    }

    // If token exists we let the request continue.
    // NOTE: this does not cryptographically verify the token.
    // The dashboard server-side getServerSession() still validates session properly.
    return NextResponse.next();
  }

  // Not a protected path
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};