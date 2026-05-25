import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {

    const { issueName, countryCode } = await params;

    // Use process.cwd() to start from the root of app
    const filePath = path.join(process.cwd(), 'data', `${issueName}.json`);

    // Read the file
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const parsedData = JSON.parse(fileData);
        
        const countryData = parsedData[countryCode]; // Find the specific country by its code

        if (!countryData) { //if no data for that country, send back 404 with message
            return NextResponse.json(
                { message: "Data not available for this country." }, 
                { status: 404 }
            );
        }

        return NextResponse.json(countryData); // Send the specific country's data back to frontend
    } catch (error) {
        console.error("File read error:", error);
        return NextResponse.json(
            { message: "Issue data not found" }, 
            { status: 404 }
        );
    }
}