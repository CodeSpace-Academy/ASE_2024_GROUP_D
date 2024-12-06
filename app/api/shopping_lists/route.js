import connectToDatabase from '../../../db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// Function to handle GET requests
async function handleGet() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('shopping_lists');
    const items = await collection.find({}).toArray();
    return items;
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    throw error;
  }
}

// Function to handle POST requests
async function handlePost(req) {
  const newItem = await req.json();
  const db = await connectToDatabase();
  const collection = db.collection('shopping_lists'); // Ensure consistent collection name
  await collection.insertOne(newItem);
  return NextResponse.json({ success: true, data: newItem }, { status: 201 });
}

// Function to handle DELETE requests
async function handleDelete(req) {
  const { id } = await req.json();
  const db = await connectToDatabase();
  const collection = db.collection('shopping_lists'); // Ensure consistent collection name
  await collection.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}

export async function GET() {
  try {
    const items = await handleGet();
    return NextResponse.json(
      { success: true, data: items }, // Ensure response structure matches client expectations
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    return await handlePost(req);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    return await handleDelete(req);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
