import { connectToDatabase } from "../../../db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { instructions } = req.body;

    if (!instructions || !Array.isArray(instructions)) {
      return res.status(400).json({ error: "Instructions must be provided as an array" });
    }

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("instructions").insertOne({ instructions });
      res.status(200).json({ message: "Instructions saved successfully", data: result });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Failed to save instructions", details: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();
      const instructions = await db.collection("instructions").find({}).toArray();
      if (instructions.length === 0) {
        return res.status(404).json({ message: "No instructions found" });
      }
      res.status(200).json({ instructions });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Failed to retrieve instructions", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
