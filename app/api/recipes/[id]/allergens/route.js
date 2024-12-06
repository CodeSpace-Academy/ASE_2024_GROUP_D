import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../db";

export async function GET(request, { params }) {
    try {
        const db = await connectToDatabase();
        const { id } = params;

        // Validate the id
        if (!id) {
            return NextResponse.json(
                { error: 'Recipe ID is required' },
                { status: 400 }
            );
        }

        // Fetch common allergens from the database
        const allergensCollection = db.collection('commonAllergens');
        const commonAllergens = await allergensCollection.find({}).toArray();

        // Extract allergen names, with a fallback
        const allergenNames = commonAllergens.length > 0
            ? commonAllergens.map(allergen => allergen.name)
            : [
                "nut", "soy", "wheat", "milk", "cheese", "cream", "egg", "fish",
                "sesame", "mustard", "corn", "clam", "mussel", "oyster", "celery"
            ];

        const recipe = await db.collection('recipes').findOne(
            { _id: id },
            { projection: { ingredients: 1, allergens: 1 } }
        );

        if (!recipe) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            );
        }

        // Existing allergens from the recipe
        const existingAllergens = recipe.allergens || [];

        // Match ingredients with common allergens if ingredients exist
        const detectedAllergens = recipe.ingredients
            ? matchIngredientsWithAllergens(recipe.ingredients, allergenNames)
            : [];

        // Combine existing and detected allergens, removing duplicates
        const combinedAllergens = Array.from(
            new Set([...existingAllergens, ...detectedAllergens])
        );

        return NextResponse.json({ allergens: combinedAllergens });
    } catch (error) {
        console.error('Error fetching allergens:', error);
        return NextResponse.json(
            { error: 'Failed to fetch allergens', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * Match recipe ingredients with known allergens
 * @param {Object} ingredients - Recipe ingredients object
 * @param {string[]} allergens - List of common allergens
 * @returns {string[]} Detected allergens in the recipe
 */
function matchIngredientsWithAllergens(ingredients, allergens) {
    if (!ingredients || typeof ingredients !== 'object') return [];

    // Normalize allergens to lowercase for case-insensitive matching
    const normalizedAllergens = allergens.map(a => a.toLowerCase());

    const detectedAllergens = new Set();

    // Iterate through ingredients
    Object.entries(ingredients).forEach(([ingredientName, quantity]) => {
        const normalizedIngredient = ingredientName.toLowerCase();

        // Check if any allergen is found in the ingredient name
        normalizedAllergens.forEach(allergen => {
            if (normalizedIngredient.includes(allergen)) {
                detectedAllergens.add(allergen);
            }
        });
    });

    // Convert Set back to array with proper capitalization
    return Array.from(detectedAllergens).map(a =>
        a.charAt(0).toUpperCase() + a.slice(1)
    );
}

// Add/update allergens to a recipe
export async function PUT(request, { params }) {
    try {
        const db = await connectToDatabase();
        const { id } = params;
        const { allergens } = await request.json();

        // Validate inputs
        if (!id) {
            return NextResponse.json(
                { error: 'Recipe ID is required' },
                { status: 400 }
            );
        }

        const result = await db.collection('recipes').updateOne(
            { _id: id },
            { $set: { allergens } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, allergens });
    } catch (error) {
        console.error('Error updating allergens:', error);
        return NextResponse.json(
            { error: 'Failed to update allergens', details: error.message },
            { status: 500 }
        );
    }
}
