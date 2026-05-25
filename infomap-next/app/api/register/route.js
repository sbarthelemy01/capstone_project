import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
    await dbConnect();

    try {
        const { email, password } = await request.json(); // Replaces req.body

        // check if user exists in database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists!" }, { status: 400 });
        }

        // save new user to MongoDB with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            email, 
            password: hashedPassword 
        });

        await newUser.save();
        
        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
}