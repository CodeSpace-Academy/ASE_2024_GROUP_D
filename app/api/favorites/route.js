import { NextResponse } from 'next/server';
import connectToDatabase from '../../../db';

export async function POST(req) {
  try {
    const { email, recipeId } = await req.json();

    if (!email || !recipeId) {
      return NextResponse.json({ error: 'Email and recipeId are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // First check if user exists, if not create them with empty favorites
    const user = await usersCollection.findOne({ email: email });
    if (!user) {
      await usersCollection.insertOne({
        email: email,
        favorites: []
      });
    }

    // Update the user's favorites array
    const updateResult = await usersCollection.updateOne(
      { email: email },
      { $addToSet: { favorites: recipeId } },
      { upsert: true } // Changed to true to create user if doesn't exist
    );

    if (updateResult.modifiedCount === 0 && updateResult.upsertedCount === 0) {
      // If recipe is already in favorites
      return NextResponse.json({ message: 'Recipe already in favorites' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Favorite added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { email, recipeId } = await req.json();

    if (!email || !recipeId) {
      return NextResponse.json({ error: 'Email and recipeId are required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    const updateResult = await usersCollection.updateOne(
      { email: email },
      { $pull: { favorites: recipeId } }
    );

    if (updateResult.modifiedCount === 0) {
      // Check if user exists
      const user = await usersCollection.findOne({ email: email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      // If user exists but recipe wasn't in favorites
      return NextResponse.json({ message: 'Recipe was not in favorites' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Favorite removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Get email from searchParams
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Fetch the user document
    const user = await usersCollection.findOne(
      { email: email },
      { projection: { favorites: 1, _id: 0 } }
    );

    if (!user) {
      // Create new user with empty favorites if doesn't exist
      await usersCollection.insertOne({
        email: email,
        favorites: []
      });
      return NextResponse.json({ favorites: [], favoritesCount: 0 }, { status: 200 });
    }

    // Ensure favorites exists
    const favorites = user.favorites || [];

    // Fetch the details of all favorited recipes from the 'recipes' collection
    const recipesCollection = db.collection('recipes');
    const favoritedRecipes = await recipesCollection.find({ _id: { $in: favorites } }).toArray();

    return NextResponse.json({
      favorites: favoritedRecipes,
      favoritesCount: favoritedRecipes.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
