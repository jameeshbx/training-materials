import { withAuth } from "next-auth/middleware";


export default withAuth({
    callbacks: {
        authorized: ({ token, req }) => {
            console.log("🔥 MIDDLEWARE RUNNING:", req.nextUrl.pathname, "ROLE:", token?.role);

            if (!token) return false;

            const pathname = req.nextUrl.pathname;

            if (pathname.startsWith("/admin")) {
                return token.role === "admin";
            }

            if (pathname.startsWith("/dashboard")) {
                // Only allow 'user' role, redirect 'admin' to home
                return token.role === "user";
            }


            return true;
        }
    },
    pages: {
        signIn: "/", // Redirect to home page if not signed in
    },
});

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],  // ⭐ FIXED
};
