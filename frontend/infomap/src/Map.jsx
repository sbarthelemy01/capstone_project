/*import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Using the 110m countries file from the world-atlas repository
const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";

const Map = () => {
  // Handle the click event on a specific country
  const handleCountryClick = (geo) => {
    // The 'geo' object contains the geographical data and properties
    const countryName = geo.properties.name;
    alert(`You clicked on: ${countryName}`);
  };

  return (
    <div style={{ width: "90vw", height: "50vh", margin: "0 auto", bottom: "0" }}>
      <ComposableMap projection="geoMercator">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountryClick(geo)}
                style={{
                  default: {
                    fill: "#D6D6DA", // Default country color
                    outline: "none",
                  },
                  hover: {
                    fill: "#FF5533", // Color when hovering over a country
                    outline: "none",
                    cursor: "pointer"
                  },
                  pressed: {
                    fill: "#E42", // Color when country is clicked
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default Map;
*/

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapChart() {
  const [tooltipData, setTooltipData] = useState(null);

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <ComposableMap projectionConfig={{ scale: 147 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                data-tooltip-id="country-tooltip"
                
                // 1. Move the state update from onMouseEnter to onClick
                onClick={() => {
                  const { name } = geo.properties;
                  const mockPop = Math.floor(Math.random() * 100000000);
                  
                  setTooltipData({
                    name: name,
                    population: mockPop.toLocaleString()
                  });
                }}
                // Note: We completely removed onMouseLeave
                
                style={{
                  default: { fill: "#D6D6DA", outline: "none" },
                  hover: { fill: "#F53", outline: "none", cursor: "pointer" },
                  pressed: { fill: "#E42", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>

      <Tooltip 
        id="country-tooltip" 
        // 2. The magic prop: tell the tooltip to ONLY trigger on click
        events={['click']}
        style={{ 
          backgroundColor: "#2c3e50", 
          color: "#fff", 
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000 // Ensures it stays on top
        }}
      >
        {tooltipData && (
          <div style={{ textAlign: "center" }}>
            <strong style={{ display: "block", fontSize: "16px", marginBottom: "4px" }}>
              {tooltipData.name}
            </strong>
            <span style={{ display: "block", fontSize: "13px", color: "#bdc3c7" }}>
              Data not yet available...
            </span>
          </div>
        )}
      </Tooltip>
    </div>
  );
}