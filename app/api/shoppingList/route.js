import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectToDatabase from '../../../db.js';

// Get a user's shopping list
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId query parameter is required' }, { status: 400 });
    }
    const db = await connectToDatabase();
    const collection = db.collection('shopping_lists');
    const shoppingList = await collection.findOne({ userId });
    if (!shoppingList) {
      return NextResponse.json({ success: false, message: 'Shopping list not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: shoppingList });
  } catch (error) {
    console.error("Error fetching shopping list:", error); // Log the error details
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Save or update a user's shopping list
export async function POST(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const itemsParam = url.searchParams.get('items');

    console.log("URL Parameters:", { userId, itemsParam }); // Log URL parameters

    if (!userId || !itemsParam) {
      return NextResponse.json({ success: false, message: 'userId and items are required' }, { status: 400 });
    }

    let newItems;
    try {
      newItems = JSON.parse(itemsParam);
      console.log("Parsed new items:", newItems); // Log parsed new items
    } catch (error) {
      console.error("Error parsing items JSON:", error); // Log JSON parsing errors
      throw new Error("Invalid items JSON");
    }

    const db = await connectToDatabase();
    const collection = db.collection('shopping_lists');
    const existingList = await collection.findOne({ userId });

    if (existingList) {
      // Append new items to the existing list
      const updatedList = await collection.updateOne(
        { userId },
        { $push: { items: { $each: newItems } } }
      );
      if (!updatedList.matchedCount) {
        return NextResponse.json({ success: false, message: 'Failed to update the shopping list' }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: updatedList });
    } else {
      // Create a new shopping list
      const result = await collection.insertOne({ userId, items: newItems });

      // Safely access the inserted document with improved error handling
      if (result && result.insertedId) {
        const newList = await collection.findOne({ _id: result.insertedId });
        return NextResponse.json({ success: true, data: newList }, { status: 201 });
      } else {
        throw new Error("Failed to retrieve the new shopping list");
      }
    }
  } catch (error) {
    console.error("Error saving shopping list:", error); // Log the error details
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Update an item in the shopping list
export async function PATCH(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const itemId = url.searchParams.get('itemId');
    const updatedItemParam = url.searchParams.get('updatedItem');

    console.log("URL Parameters:", { userId, itemId, updatedItemParam }); // Log URL parameters

    if (!userId || !itemId || !updatedItemParam) {
      return NextResponse.json({ success: false, message: 'userId, itemId, and updatedItem are required' }, { status: 400 });
    }

    let updatedItem;
    try {
      updatedItem = JSON.parse(updatedItemParam);
      updatedItem.id = itemId; // Ensure the id field is retained
      console.log("Parsed updatedItem:", updatedItem); // Log parsed updatedItem
    } catch (error) {
      console.error("Error parsing updatedItem JSON:", error); // Log JSON parsing errors
      throw new Error("Invalid updatedItem JSON");
    }

    const db = await connectToDatabase();
    const collection = db.collection('shopping_lists');
    const updatedShoppingList = await collection.updateOne(
      { userId, 'items.id': itemId },
      { $set: { 'items.$': updatedItem } }
    );
    if (!updatedShoppingList.matchedCount) {
      return NextResponse.json({ success: false, message: 'Item not found in shopping list' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedShoppingList });
  } catch (error) {
    console.error("Error updating item:", error); // Log the error details
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// Delete a shopping list or a specific item
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const itemId = url.searchParams.get('itemId');

    console.log("URL Parameters:", { userId, itemId }); // Log URL parameters

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('shopping_lists');

    if (itemId) {
      // Delete specific item
      const itemRemoved = await collection.updateOne(
        { userId },
        { $pull: { items: { id: itemId } } }
      );
      if (!itemRemoved.matchedCount) {
        return NextResponse.json({ success: false, message: 'Item not found in shopping list' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } else {
      // Delete the entire shopping list
      const deletedList = await collection.deleteOne({ userId });
      if (!deletedList.deletedCount) {
        return NextResponse.json({ success: false, message: 'Shopping list not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Error deleting shopping list or item:", error); // Log the error details
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
