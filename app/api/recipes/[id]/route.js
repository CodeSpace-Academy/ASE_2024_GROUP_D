import connectToDatabase from '../../../../db';

/**
 * Fetch a single recipe by ID from the MongoDB database.
 *
 * This function handles GET requests to retrieve a recipe document based on the
 * provided `id` parameter. It connects to the MongoDB database, queries the `recipes` 
 * collection, and returns the found recipe. If no recipe is found, or if there's a 
 * database connection issue, appropriate error responses are returned.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} param1 - An object containing the `params` object.
 * @param {Object} param1.params - Parameters from the request URL.
 * @param {string} param1.params.id - The ID of the recipe to fetch.
 *
 * @returns {Promise<Response>} A Response object containing the recipe data in JSON format
 * if found, or an error message if not found or a failure occurs.
 */
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const db = await connectToDatabase();

    if (!db) {
      // Throw an error if the database connection is not established
      throw new Error('Failed to get database connection');
    }


    // Attempt to find a single recipe by its ID in the 'recipes' collection
    const recipe = await db.collection('recipes').findOne({ _id: id });


    if (!recipe) {
      return new Response(
        JSON.stringify({ message: 'Recipe not found' }),
        { status: 404 }
      );
    }

    // If a recipe is found, return the recipe data as a JSON response
    return new Response(JSON.stringify(recipe), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    // If any error occurs during the process, log the error and return a 500 response
    console.error('Error fetching recipe:', error);

    return new Response(
      JSON.stringify({ error: 'Failed to fetch recipe', details: error.message }),
      { status: 500 }
    );
  }
}
