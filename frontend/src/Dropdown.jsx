import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import './Dropdown.css';

// Array of options for the dropdown
const globalIssues = [
  "Climate Change",
  "Food Insecurity",
  "Gender Equality",
  "Health",
  "Migration",
  "Poverty"
];

// passing props down from App.jsx
function Dropdown({ activeIssue, setActiveIssue }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Anchors the menu to the button clicked
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <header className='header-container'>
      <div className='dropdown'>
            <Autocomplete
              className='style-select'
              options={globalIssues}
              value={activeIssue || null} // Set the current value based on state
              onChange={(event, newValue) => {
                  setActiveIssue(newValue); // Update state when a user selects an issue
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select a Global Issue..." variant="outlined" />
              )}
            />
        </div>
        
    </header>    
         
        <div className='profile'>
          <Tooltip title="Profile">
            <IconButton size="large" onClick={handleMenuOpen}>
              <AccountCircle sx={{ fontSize: 50 }}/> 
            </IconButton> 
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          >

            <MenuItem onClick={handleMenuClose}>Sign In</MenuItem>
            <MenuItem onClick={handleMenuClose}>Sign Up</MenuItem>

          </Menu>
        </div>

    
        
    </>
  );
}

export default Dropdown;