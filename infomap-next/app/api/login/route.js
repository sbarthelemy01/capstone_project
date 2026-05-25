import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/User'; // use @ to reference root of project
import dbConnect from '@/lib/dbConnect'; 

export async function POST(req) {
    await dbConnect(); // Connect to MongoDB
    
    try {
        const { email, password } = await req.json();
        
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "User not found!" }, { status: 404 });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return NextResponse.json({ message: "Login successful!", token }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error logging in" }, { status: 500 });
    }
}