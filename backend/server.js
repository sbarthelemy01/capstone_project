require('dotenv').config();
const express = require('express');
const cors = require('cors'); //using cors to allow frontend to fetch data from backend without CORS issues
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');


const app = express();
app.use(cors()); 
app.use(express.json()); // for POST/PUT requests from frontend


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB Atlas!"))
    .catch((err) => console.error("MongoDB connection error:", err));


// user registration route - sign up
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // check if user exists in database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // save new user to MongoDB with hashed password
        const newUser = new User({ 
            email, 
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});


//user login route - sign in
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // see if user exists in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // compare provided password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // generate JWT token, expires in 1 hour
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful!", token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});


// middleware function to verify user authentication using JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // extracts token from "Bearer <token>"

    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) 
            return res.status(403).json({ message: "Invalid token" });
        req.user = user; // attach user info from token to request object for use in route handlers
        next();
    });
};

// route to add/remove a country to/from user's favorites list in their profile
app.post('/api/favorites', authenticateToken, async (req, res) => {
    const { issue, countryName, data } = req.body;

    try {
        const user = await User.findById(req.user.id);
        
        // Check if this country/issue combo is already in user's favorites
        const existingFavIndex = user.favorites.findIndex(
            fav => fav.issue === issue && fav.countryName === countryName
        );

        if (existingFavIndex >= 0) {
            // if it exists, remove it from favorites
            user.favorites.splice(existingFavIndex, 1);
            await user.save();
            return res.json({ message: "Removed from favorites", status: "removed" });
        } else {
            // if it doesn't exist, add it to favorites
            user.favorites.push({ issue, countryName, data });
            await user.save();
            return res.json({ message: "Added to favorites", status: "added" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating favorites" });
    }
});

//route to get the user's favorites list (in the backend) to be displayed in their profile page (frontend)
app.get('/api/favorites', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // using reverse function to show recently added items first
        res.json(user.favorites.reverse()); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching favorites" });
    }
});



// API endpoint to get data for a specific country and issue
app.get('/api/issues/:issueName/countries/:countryCode', (req, res) => {
    const { issueName, countryCode } = req.params;

    // path to correct JSON file -> backend/data/climate_change.json
    const filePath = path.join(__dirname, 'data', `${issueName}.json`);

    //console.log(`Requested country code: ${countryCode}`);


    // Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("File not found:", err);
            return res.status(404).json({ message: "Issue data not found" });
        }

        const parsedData = JSON.parse(data);
        const countryData = parsedData[countryCode]; // Find the specific country by

        //if no data for that country, send back 404 with message
        if (!countryData) {
            return res.status(404).json({ message: "Data not available for this country." });
        }

        // Send the specific country's data back to frontend
        res.json(countryData);
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000')); //listening on port 3000