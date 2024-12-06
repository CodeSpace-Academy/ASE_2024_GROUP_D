import bcrypt from "bcryptjs";
import connectToDatabase from "../../../../db";

/**
 * Handles the POST request to create a new user.
 * This function checks if a user with the provided email already exists.
 * If not, it hashes the provided password and inserts the new user into the database.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming HTTP request containing user data.
 * @returns {Promise<Response>} A promise that resolves to a Response object.
 *                             The response indicates the success or failure of the user creation process.
 *                             - If the user already exists, a 400 status with an error message is returned.
 *                             - If the user is created successfully, a 201 status with a success message is returned.
 */
export async function POST(request) {
    const { fullName, email, phoneNumber, password } = await request.json();
    const db = await connectToDatabase();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
        return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({ fullName, email, phoneNumber, password: hashedPassword });

    return new Response(JSON.stringify({ message: "User created successfully" }), { status: 201 });
}







