import { getSession } from "next-auth/react";

export async function middleware(req) {
    const session = await getSession({ req });

    const url = req.nextUrl.clone();

    // Redirect to login if user is not authenticated and accessing protected routes
    if (!session && req.nextUrl.pathname.startsWith("/api/recipes/")) {
        url.pathname = "/api/auth/login";
        return NextResponse.redirect(url);
    }

    // Continue if authenticated
    return NextResponse.next();
}

export const config = {
    matcher: ["/api/recipes/:path*"], // Apply middleware to /api/recipes routes
};