const express = require('express');
const cors = require('cors'); //using cors to allow frontend to fetch data from backend without CORS issues
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors()); 
//app.use(express.json()); // for POST/PUT requests



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