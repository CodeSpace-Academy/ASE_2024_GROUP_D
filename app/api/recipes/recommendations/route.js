import connectToDatabase from "../../../../db"; // Adjust the path based on your actual DB utility

export async function GET() {
  try {
    const db = await connectToDatabase(); // Connect to the database
    
    // Perform aggregation to calculate average rating for each recipe
    const recipes = await db.collection("recipes").aggregate([
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" }, // Calculate average rating of reviews
        },
      },
      {
        $match: {
          averageRating: { $exists: true, $ne: null }, // Only include recipes with an averageRating
        },
      },
      {
        $sort: { averageRating: -1 }, // Sort by averageRating in descending order
      },
      {
        $limit: 10, // Limit to top 10 recipes
      },
    ]).toArray();

    // Return the top 10 recipes with average ratings
    return new Response(JSON.stringify(recipes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching top-rated recipes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch top-rated recipes" }),
      { status: 500 }
    );
  }
}
