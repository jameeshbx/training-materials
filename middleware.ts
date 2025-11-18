import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},

  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (!token) return false; // not logged in

        if (path.startsWith("/admin")) {
          return token.role === "admin"; // only admin allowed
        }

        if (path.startsWith("/dashboard")) {
          return true; // any logged in user
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};