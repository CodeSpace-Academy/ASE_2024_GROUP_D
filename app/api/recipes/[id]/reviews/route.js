//api/recipes/[id]/reviews/routes.js

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../db';
import {
  createReview,
  updateReview,
  deleteReview,
  getRecipeReviews
} from '../../../../review';

async function validateRecipe(recipeId) {
  const db = await connectToDatabase();
  
  if (!recipeId) {
    throw new Error('Recipe ID is required');
  }

  const recipe = await db.collection('recipes').findOne({ _id: recipeId });
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  return recipe;
}

// Create review
export async function POST(request) {
  try {
    //const body2 = await request.text();  // Get the raw body as text for debugging
    //console.log("Raw request body:", body2);  // Log the body for debugging

    const body = await request.json(); // Parse JSON from the request body

    // Destructure and log each field individually
    const {rating, comment, recipeId } = body;
    console.log("recipeId:", recipeId);
    console.log("rating:", rating);
    console.log("comment:", comment);


    // Validate the recipe ID
    await validateRecipe(recipeId);
    
    // Connect to database and create review
    const db = await connectToDatabase();
    const review = await createReview(db, body);
    
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}

// Update review
// Update review
export async function PUT(request) {
  try {
    // Retrieve `editId` from the query parameters
    const url = new URL(request.url);
    const reviewId = url.searchParams.get('editId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required for update' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const db = await connectToDatabase();
    await updateReview(db, reviewId, body);

    return NextResponse.json({ message: 'Review updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
// Delete review
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const deleteId = url.searchParams.get('deleteId');

    if (!deleteId) {
      return NextResponse.json({ error: 'deleteId query parameter is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    await deleteReview(db, deleteId);

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


// Get reviews for a recipe
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const recipeId = id;
    await validateRecipe(recipeId);
    
    console.log('Did we get ValidateRecipe?')

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const sortOptions = {
      sortBy: searchParams.get('sortBy') || 'date',
      order: searchParams.get('order') || 'desc'
    };
    
    const db = await connectToDatabase();
    const reviews = await getRecipeReviews(db, recipeId, sortOptions);
    
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { 
        status: error.message.includes('not found') ? 404 : 
                error.message.includes('required') ? 400 : 500 
      }
    );
  }
}
