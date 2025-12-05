

// import { NextResponse } from "next/server";
// import type { NextRequest, NextFetchEvent } from "next/server";
// import { withAuth } from "next-auth/middleware";

// /* -------------------------------------------------------
//    ⭐ ONLY route protection remains here (no login rate limiter)
// ------------------------------------------------------- */
// const authMiddleware = withAuth({
//     callbacks: {
//         authorized: ({ token, req }) => {
//             const pathname = req.nextUrl.pathname;

//             console.log("🔥 MIDDLEWARE RUNNING:", pathname, "ROLE:", token?.role);

//             // Public invite routes
//             if (pathname.startsWith("/accept-invite")) return true;
//             if (pathname.startsWith("/api/accept-invite")) return true;

//             // Must be logged in
//             if (!token) return false;

//             // Admin-only routes
//             if (pathname.startsWith("/admin")) {
//                 return token.role === "admin";
//             }

//             // User dashboard
//             if (pathname.startsWith("/dashboard")) {
//                 return token.role === "user";
//             }

//             // Admin blocked from user-only pages
//             const blockForAdmin = ["/tasks", "/reports", "/teams"];
//             if (token.role === "admin") {
//                 if (blockForAdmin.some((route) => pathname.startsWith(route))) {
//                     console.log("🚫 ADMIN BLOCKED:", pathname);
//                     return false;
//                 }
//             }

//             return true;
//         },
//     },
//     pages: { signIn: "/" },
// });

// /* -------------------------------------------------------
//    ⭐ final middleware: simply run withAuth (no login limiter)
// ------------------------------------------------------- */
// export function middleware(req: NextRequest, event: NextFetchEvent) {
//     const pathname = req.nextUrl.pathname;

//     // keep logging for debugging
//     console.log("PATHNAME:", pathname);

//     // run withAuth protection (unchanged)
//     return authMiddleware(req, event);

// }

// /* -------------------------------------------------------
//    ⭐ MATCHERS (unchanged)
// ------------------------------------------------------- */
// export const config = {
//     matcher: [
//         "/dashboard/:path*",
//         "/admin/:path*",
//         "/tasks/:path*",
//         "/reports/:path*",
//         "/teams/:path*",
//         "/accept-invite/:path*",
//         "/api/accept-invite/:path*",
//         "/api/auth/:path*", // optional to keep (no blocking now)
//     ],
// };


import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

/* -------------------------------------------------------
   ⭐ Route Protection Logic (unchanged)
------------------------------------------------------- */

function authorizationLogic({ token, req }: any) {
    const pathname = req.nextUrl.pathname;

    console.log("🔥 MIDDLEWARE RUNNING:", pathname, "ROLE:", token?.role);

    // Public invite routes
    if (pathname.startsWith("/accept-invite")) return true;
    if (pathname.startsWith("/api/accept-invite")) return true;

    // Must be logged in
    if (!token) return false;

    // Admin-only routes
    if (pathname.startsWith("/admin")) {
        return token.role === "admin";
    }

    // User dashboard
    if (pathname.startsWith("/dashboard")) {
        return token.role === "user";
    }

    // Admin blocked from user-only pages
    const blockForAdmin = ["/tasks", "/reports", "/teams"];
    if (token.role === "admin") {
        if (blockForAdmin.some((route) => pathname.startsWith(route))) {
            console.log("🚫 ADMIN BLOCKED:", pathname);
            return false;
        }
    }

    return true;
}

/* -------------------------------------------------------
   ⭐ Export the middleware using withAuth (Required by NextAuth v5)
------------------------------------------------------- */

export default withAuth(
    function middleware(req: NextRequest) {
        console.log("PATHNAME:", req.nextUrl.pathname); // your logging
    },
    {
        callbacks: {
            authorized: authorizationLogic,
        },
        pages: { signIn: "/" },
    }
);

/* -------------------------------------------------------
   ⭐ MATCHERS (unchanged)
------------------------------------------------------- */
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/tasks/:path*",
        "/reports/:path*",
        "/teams/:path*",
        "/accept-invite/:path*",
        "/api/accept-invite/:path*",
        "/api/auth/:path*",
    ],
};
