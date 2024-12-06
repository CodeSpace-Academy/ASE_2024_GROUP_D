import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../db';

export async function GET(req, { params }) {
    try {
        const { email } = params;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Fetch user profile by email
        const user = await usersCollection.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return the user profile data
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const {  fullName, email, phoneNumber, password } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Update user profile with provided data
        const updateResult = await usersCollection.updateOne(
            { email: email },
            { $set: { fullName, phoneNumber, password } }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ error: 'User not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

