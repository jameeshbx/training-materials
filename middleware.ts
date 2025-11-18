import { withAuth } from "next-auth/middleware";



export default withAuth(
    function middleware(req) {
        // Optional: for future expansions
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);


export const config = {
    matcher: ["/dashboard/:path*"],
};

