import connectToDatabase from '../../../../../db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

/**
 * Update a recipe's description in the MongoDB database.
 *
 * This function handles PATCH requests to update a recipe document's description
 * based on the provided `id` parameter. It verifies if the user is logged in,
 * validates the new description, and updates the recipe with the new description,
 * the ID of the editing user, and a timestamp.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Object} param1 - An object containing the `params` object.
 * @param {Object} param1.params - Parameters from the request URL.
 * @param {string} param1.params.id - The ID of the recipe to update.
 *
 * @returns {Promise<Response>} A Response object with success or error messages.
 */
export async function PATCH(request, { params }) {
    try {
        //gets url params
        const url = new URL(request.url);
  
        // Parse the request body
        let body;
        try {
            body = await request.json();
            console.log("Request Body:", body);
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }
        //get new desciption input
        const { description } = body;

        if (!description?.trim()) {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }
    
        const db = await connectToDatabase();

        // Validate recipe ID as a string
        if (!params.id || typeof params.id !== 'string') {
            return NextResponse.json(
                { error: 'Invalid recipe ID format' },
                { status: 400 }
            );
        }

        const recipeId = params.id; // Use the string ID directly

        console.log("Looking for recipe with ID:", recipeId);
//_________________________________________________________________________________________



        // Log the existing recipes in the collection for debugging// Logs new Info into DataBase with email
        const recipe = await db.collection('recipes').findOne({ _id: recipeId });
        if (!recipe) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            );
        }


        // Update recipe with all required fields in one operation
       const emailData= url.searchParams.get('email')
       console.log("Description to update:", description);
       console.log("Email of editor:", emailData);
        const result = await db.collection('recipes').findOneAndUpdate(
            { _id: recipeId },
            {
                $set: {
                    description: description.trim(),
                   lastEditedBy: emailData,
                    lastEditedAt: new Date(),
                }
            },
            { returnDocument: 'after' } // This returns the updated document
        );
//______________________________________________________________________________




        // Handle recipe not found or no update
        if (!result) {
            return NextResponse.json(
                { error: 'Recipe not found or no changes made' },
                { status: 404 }
            );
        }


        // Return success response with updated data
        return NextResponse.json({
            message: 'Recipe updated successfully',
            description: result.description,
            lastEditedBy: result.lastEditedBy,
            lastEditedAt: result.lastEditedAt
        });

    } catch (error) {
        console.error('Recipe update failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
