import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip"; 

import "react-tooltip/dist/react-tooltip.css"; //importing css for formatting
import './Map.css';
 
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MapChart({ activeIssue }) {
  //tracking selected country and tooltip visibility
  const [tooltipData, setTooltipData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  
  const issueColors = {
    "Climate Change": "#228b22",
    "Food Insecurity": "#ffdb58",
    "Gender Equality": "#bf40bf",
    "Health": "#add8e6",
    "Migration": "#4b0082",
    "Poverty": "#8b0000" 
  };

  const currentMapColor = issueColors[activeIssue] || "#D6D6DA";

  return (
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
                  
                  onClick={() => {
                    setSelectedCountry(geo.rsmKey);
                    
                    const name = geo.properties.name || `Country ID: ${geo.id}`; 
                    const mockPop = Math.floor(Math.random() * 100000000);
                    
                    setTooltipData({
                      name: name,
                      population: mockPop.toLocaleString()
                    });
                    
                    // open tooltip immediately
                    setIsTooltipOpen(true); 
                  }}
                  
                  // popup closes immediately when mouse leaves selected country
                  onMouseLeave={() => setIsTooltipOpen(false)}
                  
                  // re-open tooltip when mouse re-enters selected country
                  onMouseEnter={() => {
                    if (isSelected && tooltipData) {
                      setIsTooltipOpen(true);
                    }
                  }}
                  style={{
                    default: { 
                      fill: isSelected ? "#2f4f4f" : currentMapColor,  //base color of map
                      outline: "none",
                      transition: "all 250ms"
                    },
                    hover: { 
                      fill: "#2f4f4f", 
                      outline: "none", 
                      cursor: "pointer",
                      transition: "all 250ms" 
                    },
                    pressed: { 
                      fill: "#1a2c2c",
                      outline: "none" 
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip //using MUI tooltip for each country
        id="country-tooltip" 
        isOpen={isTooltipOpen} 
        style={{ 
          backgroundColor: "#2c3e50", 
          color: "#fff", 
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          zIndex: 1000 
        }}
      >
        {tooltipData && (
          <div style={{ textAlign: "center" }}>
            <strong style={{ display: "block", fontSize: "16px", marginBottom: "4px" }}>
              {tooltipData.name}
            </strong>
            <span style={{ display: "block", fontSize: "13px", color: "#bdc3c7", marginBottom: "8px" }}>
              Pop: {tooltipData.population}
            </span>
            <span style={{ display: "block", fontSize: "13px", color: "#bdc3c7", marginBottom: "12px" }}>
              Data not yet available...
            </span>
          </div>
        )}
      </Tooltip>
    </div>
  );
}