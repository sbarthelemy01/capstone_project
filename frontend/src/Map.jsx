import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip"; 

import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

import "react-tooltip/dist/react-tooltip.css"; // Importing CSS for the tooltip
import './Map.css';
 
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"; // TopoJSON URL from world-atlas

//helper function to change JSON keys into readable headers (popup window). ex: environmental_impact -> Environmental Impact
const formatHeader = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

export default function Map({ activeIssue }) {
  const [tooltipData, setTooltipData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); //tracks whether the currently selected country is in the user's favorites list
  
  useEffect(() => { //useEffect is listening to activeIssue, runs every time activeIssue changes
    setSelectedCountry(null); // removes previously selected country (highlight is cleared)
    setTooltipData(null);     // clears data in tooltip
  }, [activeIssue]);


  const issueColors = {
    "Climate Change": "#228b22",
    "Food Insecurity": "#ffdb58",
    "Gender Equality": "#bf40bf",
    "Health": "#add8e6",
    "Migration": "#4b0082",
    "Poverty": "#8b0000" 
  };

  const currentMapColor = issueColors[activeIssue] || "#D6D6DA";

  // Function to handle clicking on a country
  const handleCountryClick = async (geo) => {
    const countryCode = geo.id; // iso numeric code, e.g., "840" for USA
    const countryName = geo.properties.name; // e.g., "United States"

    //console.log("Object selected:", geo);
    //console.log("The country code selected is: ", countryCode);
    //console.log(countryName);
    

    setSelectedCountry(geo.rsmKey);
    setIsFavorite(false);

    // If no issue is selected from the NavBar, prompt the user
    if (!activeIssue) {
        setTooltipData({ name: countryName, summary: "Please select a global issue from the dropdown menu." });
        return;
    }

    // loading state while fetching data from backend
    setTooltipData({ name: countryName, summary: "Loading data..." });

    // Format the issue name to match JSON files (e.g., "Climate Change" -> "climate_change")
    const formattedIssue = activeIssue.toLowerCase().replace(' ', '_');

    try {
      // Fetch data from the backend API for selected country and issue
      const response = await fetch(`http://localhost:3000/api/issues/${formattedIssue}/countries/${countryCode}`);
      //console.log("Response: ", response);

      if (!response.ok) {
        throw new Error("Data not found");
      }

      // Parse the JSON returned by Express
      const data = await response.json();

      setTooltipData({ //country name + summarized info from backend
        name: countryName,
        ...data
      });

    } catch(err) { //if no data for that country, show "No data available" in tooltip summary
      console.error(err);
      setTooltipData({ name: countryName, summary: "No data available for this country."}); 
    }
  };

  const handleCloseTooltip = () => {
    setTooltipData(null);
    setSelectedCountry(null);
  };

  const handleFavoriteToggle = async () => {
    // Check if user is authenticated before allowing them to favorite a country
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please sign in to save this to your favorites!");
      return;
    }

    setIsFavorite(!isFavorite);

    //send data to backend to save selected country to user's favorites list in database.
    try {
      await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` //sends the user's ID securely
        },
        body: JSON.stringify({
          issue: activeIssue,
          countryName: tooltipData.name,
          data: tooltipData
        })
      });

    } catch (error) {
      console.error("Failed to save to favorites:", error);
    }
  };

  return (//ComposableMap is the base wrapper, Geographies is the collection of all countries <- fetches and processes the TopoJSON
    <div className="map-container">
      <ComposableMap id="map" projectionConfig={{ scale: 147 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isSelected = selectedCountry === geo.rsmKey;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  data-tooltip-id="country-tooltip"
                  onClick={() => handleCountryClick(geo)}
                  style={{ // Style the default, hover, and active states of each country
                    default: { 
                      fill: isSelected ? "#2f4f4f" : currentMapColor, // Fill color based on selected issue, or default if no issue selected
                      stroke: "#2a4444",   // Border color
                      outline: "none",
                      transition: "all 250ms"
                    },
                    hover: { 
                      fill: "#2f4f4f", // Dark shade on hover
                      outline: "none", 
                      cursor: "pointer",
                      transition: "all 250ms" 
                    },
                    pressed: { 
                      fill: "#1a2c2c", // Darker shade when pressed
                      outline: "none" 
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip 
        id="country-tooltip" 
        clickable={true} //allows scrolling/clicking inside tooltip
        openOnClick={true} // Opens when country is clicked
        globalCloseEvents={{ clickOutsideAnchor: true }} // Closes when clicking outside selected country or tooltip
        style={{ 
          backgroundColor: "#2c3e50", 
          color: "#fff", 
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "350px", 
          maxHeight: "300px",
          overflowY: "auto",  // add scroll bar if text is too long
          boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000 
        }}
      >
        {tooltipData && (
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
            
          {/* using flexbox to align items; putting country name to the left and the icon group to the right */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #7f8c8d", paddingBottom: "8px" }}>
              <strong style={{ fontSize: "20px" }}>
                {tooltipData.name}
              </strong>
              
              {/* icon group in tooltip */}
              <div style={{ display: "flex", gap: "4px" }}>
                <Tooltip id="fav-tooltip" place="top" content="Save to Favorites" />
                <IconButton 
                  size="small" 
                  data-tooltip-id="fav-tooltip"
                  onClick={handleFavoriteToggle}
                  sx={{ color: '#ff160c' }} // red for the heart
                >
                  {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                </IconButton>

                <IconButton 
                  size="small" 
                  onClick={handleCloseTooltip}
                  sx={{ color: '#c0c0c0' }} // light gray for close button
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </div>
            </div>


            {/* Renders "Loading" or "No Data" summary if it exists */}
            {tooltipData.summary && (
                <span style={{ display: "block", fontSize: "14px", color: "#bdc3c7", textAlign: "center" }}>
                    {tooltipData.summary}
                </span>
            )}

            {/* Looping through JSON data to create headers and paragraphs */}
            {Object.entries(tooltipData).map(([key, value]) => {
              if (["name", "country_name", "summary"].includes(key)) { // <- skip these keys 
                return null;
              }

              return (
                  <div key={key}>
                    
                      {/* Header */}
                      <strong style={{ color: "#000080", fontSize: "14px", display: "block", marginBottom: "4px" }}>
                          {formatHeader(key)}:
                      </strong>

                      {/* Text Body */}
                      <span style={{ fontSize: "13px", color: "#ecf0f1", lineHeight: "1.5", display: "block" }}>
                          {value}
                      </span>
                  </div>
              );
            })}
          </div>
        )}
      </Tooltip>
    </div>
  );
}