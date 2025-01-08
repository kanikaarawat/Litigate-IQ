import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    // Extract search query parameter
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      console.warn("Search query parameter is empty.");
      return NextResponse.json(
        { error: "Search query cannot be empty." },
        { status: 400 }
      );
    }

    console.log("Search query received:", query);

    // Perform a text search in the 'cases' collection
    const results = await db
      .collection("cases")
      .find({ $text: { $search: query } })
      .toArray();

    console.log("Search results from database:", results);

    // Transform results for consistent response structure
    const transformedResults = results.map((result) => ({
      id: result._id.toString(), // Convert ObjectId to string
      title: result.title || "Untitled Case",
      description: result.description || "No description available",
      content: result.content || "No content available",
    }));

    return NextResponse.json({ query, results: transformedResults });
  } catch (error) {
    console.error("Error performing search:", error);
    return NextResponse.json(
      { error: "Failed to perform search operation." },
      { status: 500 }
    );
  }
}
