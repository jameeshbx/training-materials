
import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            console.log("🔥 MIDDLEWARE RUNNING:", req.nextUrl.pathname, "ROLE:", token?.role);

            if (!token) return false;

            const pathname = req.nextUrl.pathname;

            // ⭐ Existing Feature: Admin-only routes
            if (pathname.startsWith("/admin")) {
                return token.role === "admin";
            }

            // ⭐ Existing Feature: Dashboard - admin cannot access
            if (pathname.startsWith("/dashboard")) {
                return token.role === "user";
            }

            // ⭐ NEW FEATURE: Block admin from tasks, reports, teams
            const adminBlockedRoutes = ["/tasks", "/reports", "/teams"];

            if (token.role === "admin") {
                if (adminBlockedRoutes.some((route) => pathname.startsWith(route))) {
                    console.log("🚫 ADMIN BLOCKED:", pathname);
                    return false; // Deny access
                }
            }

            return true;
        }
    },
    pages: {
        signIn: "/", // Redirect if not logged in
    },
});

// ⭐ Add new pages to matcher
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/tasks/:path*",    // NEW
        "/reports/:path*",  // NEW
        "/teams/:path*",    // NEW
    ],
};
