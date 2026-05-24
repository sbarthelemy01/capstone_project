const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },

    favorites: [{
        issue: String,
        countryName: String,
        data: Object, // stores the data for the selected country, so it can be displayed in the user's profile w/out needing to fetch again from backend
        savedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', userSchema); // export the User model for use in server.js