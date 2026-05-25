import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

//helper function to extract and verify JWT token from request headers (replaces middleware in Express)
const getUserFromToken = (request) => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return null;

    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        return null;
    }
};

// GET: Fetch user's favorites list to display in profile page
export async function GET(request) {
    await dbConnect();
    
    const userPayload = getUserFromToken(request);
    if (!userPayload) {
        return NextResponse.json({ message: "Access denied or invalid token" }, { status: 401 });
    }

    try {
        const user = await User.findById(userPayload.id);
        return NextResponse.json(user.favorites.reverse());
    } catch (error) {
        return NextResponse.json({ message: "Error fetching favorites" }, { status: 500 });
    }
}

//POST: Save/remove a country to/from user's favorites list in their profile
export async function POST(request) {
    await dbConnect();
    
    const userPayload = getUserFromToken(request);
    if (!userPayload) {
        return NextResponse.json({ message: "Access denied or invalid token" }, { status: 401 });
    }

    try {
        const { issue, countryName, data } = await request.json();
        const user = await User.findById(userPayload.id);
        
        const existingFavIndex = user.favorites.findIndex(
            fav => fav.issue === issue && fav.countryName === countryName
        );

        if (existingFavIndex >= 0) {
            // if it exists, remove it from favorites
            user.favorites.splice(existingFavIndex, 1);
            await user.save();
            return NextResponse.json({ message: "Removed from favorites", status: "removed" });
        } else {
            // if it doesn't exist, add it to favorites
            user.favorites.push({ issue, countryName, data });
            await user.save();
            return NextResponse.json({ message: "Added to favorites", status: "added" });
        }
    } catch (error) {
        return NextResponse.json({ message: "Error updating favorites" }, { status: 500 });
    }
}