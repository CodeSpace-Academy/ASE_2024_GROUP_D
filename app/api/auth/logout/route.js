import { serialize } from "cookie";

/**
 * Handles the POST request to log out a user.
 * This function clears the authentication token by setting 
 * the `authToken` cookie to an empty value and an expiration date in the past.
 * 
 * @async
 * @function POST
 * @returns {Promise<Response>} A promise that resolves to a Response object containing
 *                             a JSON message indicating successful logout.
 *                             The response includes a Set-Cookie header to clear the
 *                             `authToken` cookie.
 */
export async function POST() {
    return new Response(
        JSON.stringify({ message: "Logged out successfully" }),
        {
            status: 200,
            headers: {
                "Set-Cookie": serialize("authToken", "", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: -1, // Cookie expires immediately
                    sameSite: "strict",
                    path: "/",
                }),
            },
        }
    );
}