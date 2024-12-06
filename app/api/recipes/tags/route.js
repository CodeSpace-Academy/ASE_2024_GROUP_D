import connectToDatabase from "../../../../db";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const tags = await db.collection('recipes').distinct('tags');
    console.log("Fetched tags:", tags); 
    return new Response(JSON.stringify(tags), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tags" }), {
      status: 500,
    });
}
}