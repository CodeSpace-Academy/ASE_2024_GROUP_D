import connectToDatabase from "../../../../db";

/**
 * Handles GET requests to fetch distinct categories from the categories collection.
 * 
 * @param {Request} req - The request object representing the incoming HTTP request.
 * @returns {Response} A JSON response containing an array of distinct categories or an error message.
 */
export async function GET(req) {
    try {
        const db = await connectToDatabase();

        {/** fetch categories from the categories collection */}
        const categories = await db.collection('categories').distinct('categories');

          {/**return a successful response with the categories in JSON format*/}
        return new Response(JSON.stringify(categories), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
           {/**log the error message for debugging*/}
        console.error('Error fetching categories:', error.message);

           {/**return an error response with status 500*/}
        return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
