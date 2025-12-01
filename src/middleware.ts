
// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//     callbacks: {
//         authorized: ({ token, req }) => {
//             console.log("🔥 MIDDLEWARE RUNNING:", req.nextUrl.pathname, "ROLE:", token?.role);

//             if (!token) return false;

//             const pathname = req.nextUrl.pathname;

//             //  Admin-only routes
//             if (pathname.startsWith("/admin")) {
//                 return token.role === "admin";
//             }

//             //  Dashboard - admin cannot access
//             if (pathname.startsWith("/dashboard")) {
//                 return token.role === "user";
//             }

//             //  Block admin from tasks, reports, teams
//             const adminBlockedRoutes = ["/tasks", "/reports", "/teams"];

//             if (token.role === "admin") {
//                 if (adminBlockedRoutes.some((route) => pathname.startsWith(route))) {
//                     console.log("🚫 ADMIN BLOCKED:", pathname);
//                     return false; // Deny access
//                 }
//             }

//             return true;
//         }
//     },
//     pages: {
//         signIn: "/", // Redirect if not logged in
//     },
// });


// export const config = {
//     matcher: [
//         "/dashboard/:path*",
//         "/admin/:path*",
//         "/tasks/:path*",
//         "/reports/:path*",
//         "/teams/:path*",
//     ],
// };


import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {

            const pathname = req.nextUrl.pathname;

            console.log(
                "🔥 MIDDLEWARE RUNNING:",
                pathname,
                "ROLE:",
                token?.role
            );

            // ⭐ BYPASS INVITE ROUTES (No auth required here)
            if (pathname.startsWith("/accept-invite")) {
                return true;
            }

            if (pathname.startsWith("/api/accept-invite")) {
                return true;
            }

            // ⭐ If no session token → user is NOT logged in
            if (!token) return false;

            // Admin-only pages
            if (pathname.startsWith("/admin")) {
                return token.role === "admin";
            }

            // Dashboard - only normal users
            if (pathname.startsWith("/dashboard")) {
                return token.role === "user";
            }

            // Admin blocked routes
            const adminBlockedRoutes = ["/tasks", "/reports", "/teams"];

            if (token.role === "admin") {
                if (adminBlockedRoutes.some((route) => pathname.startsWith(route))) {
                    console.log("🚫 ADMIN BLOCKED:", pathname);
                    return false;
                }
            }

            return true;
        }
    },
    pages: {
        signIn: "/",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/tasks/:path*",
        "/reports/:path*",
        "/teams/:path*",
        "/accept-invite/:path*",     // ⭐ Add this
        "/api/accept-invite/:path*", // ⭐ Add this
    ],
};
