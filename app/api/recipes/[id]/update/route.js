import connectToDatabase from '../../../../../db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

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
        const session = await getServerSession(authOptions);

        // Check if user is authenticated
        if (!session?.user?.email) {
            console.log("No session found - authentication failed");
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Log the authenticated user
        console.log("Authenticated user:", session.user);

        // Parse the request body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const { description } = body;

        if (!description?.trim()) {
            return Response.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }

        const db = await connectToDatabase();

        // Convert string ID to MongoDB ObjectId
        let objectId;
        try {
            objectId = new ObjectId(params.id);
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid recipe ID format' },
                { status: 400 }
            );
        }

        // Update recipe with all required fields in one operation
        const result = await db.collection('recipes').findOneAndUpdate(
            { _id: objectId },
            {
                $set: {
                    description: description.trim(),
                    lastEditedBy: session.user.email,
                    lastEditedAt: new Date(),
                }
            },
            { returnDocument: 'after' } // This returns the updated document
        );

        // Handle recipe not found
        if (!result.value) {
            return NextResponse.json(
                { error: 'Recipe not found' },
                { status: 404 }
            );
        }

        // Return success response with updated data
        return NextResponse.json({
            message: 'Recipe updated successfully',
            description: result.value.description,
            lastEditedBy: result.value.lastEditedBy,
            lastEditedAt: result.value.lastEditedAt
        });

    } catch (error) {
        console.error('Recipe update failed:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
