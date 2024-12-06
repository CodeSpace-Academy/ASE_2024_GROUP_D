import connectToDatabase from "../../../../db";

/**
 * Checks if a user exists based on the email provided in the request body.
 *
 * @async
 * @function POST
 * @param {Request} req - The incoming HTTP request with JSON body containing the email.
 * @returns {Promise<Response>} A promise that resolves to a Response object:
 *                              - 200 if the user exists.
 *                              - 404 if the user is not found.
 */
export async function POST(req) {
  try {
    const { email } = await req.json();
    const db = await connectToDatabase();

    // Check if the user exists
    const user = await db.collection("users").findOne({ email });

    if (user) {
      return new Response(JSON.stringify({ message: "User exists" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
  } catch (error) {
    console.error("Error in checking user existence:", error);
    return new Response(JSON.stringify({ message: "An error occurred" }), { status: 500 });
  }
}
