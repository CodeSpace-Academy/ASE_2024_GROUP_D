import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie"; // Import serialize as a named import
import connectToDatabase from "../../../../db";

/**
 * Handles the POST request to log in a user.
 * This function verifies the user's email and password against the database.
 * If valid, it generates a JWT and sets it in a cookie.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request containing user credentials.
 * @returns {Promise<Response>} A promise that resolves to a Response object.
 *                             - If the user is not found, a 400 status with an error message is returned.
 *                             - If the password is invalid, a 400 status with an error message is returned.
 *                             - If the login is successful, a 200 status with a success message is returned,
 *                               along with a Set-Cookie header containing the JWT.
 */
export async function POST(req) {
    const { email, password } = await req.json();
    const db = await connectToDatabase();

    const user = await db.collection("users").findOne({ email });
    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return new Response(JSON.stringify({ message: "Invalid password" }), { status: 400 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Serialize the cookie
    const cookie = serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600,
        sameSite: 'strict',
        path: '/',
    });

    return new Response(
        JSON.stringify({ message: "Logged in successfully" }),
        {
            status: 200,
            headers: {
                "Set-Cookie": cookie,
            },
        }
    );
}