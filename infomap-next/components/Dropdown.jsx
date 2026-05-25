'use client';

import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

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

  //menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  //auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('login'); // 'login' or 'register'
  
  //form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  //profile state
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    }, 0);

    // cleanup function
    return () => clearTimeout(timer);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget); // anchors the menu to the profile icon when clicked
  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenDialog = (mode) => {
    setDialogMode(mode);
    setAuthDialogOpen(true);
    handleMenuClose();

    setEmail(''); // clear form fields and error messages when opening the dialog
    setPassword('');
    setErrorMsg('');
  };

  const handleCloseDialog = () => setAuthDialogOpen(false);

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Delete the secure token
    setIsLoggedIn(false);             // Update the UI
    handleMenuClose();
  };

  // function to open the profile dialog and fetch user's favorites
  const handleOpenProfile = async () => {
    handleMenuClose();
    setProfileDialogOpen(true);
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUserFavorites(data);
      }
    } catch (err) {
      console.error("Failed to load favorites", err);
    }
  };

  // form handler for both login and registration based on the current dialog mode
  const handleSubmit = async () => {
    setErrorMsg(''); // Clear previous errors
    
    const endpoint = dialogMode === 'login' ? '/api/login' : '/api/register'; // determine which API endpoint to call based on the dialog mode

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Uh oh! Something went wrong :(");
      }

      // for successful login or registration
      if (dialogMode === 'login') {

        localStorage.setItem('token', data.token); // Store the JWT token in localStorage
        setIsLoggedIn(true);
        setAuthDialogOpen(false); // close popup after successful login
      } else {
        // if user just registered, automatically switch to the login screen
        setDialogMode('login');
        setErrorMsg('Registration successful! Please log in.');
      }
      
    } catch (error) { //for failed login or registration, display the error message in the dialog
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      <header className='header-container'>
        <div className='dropdown'>
          <Autocomplete
            className='style-select'
            options={globalIssues}
            value={activeIssue || null} // Set the current value based on state
            onChange={(event, newValue) => setActiveIssue(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select a Global Issue..." variant="outlined" />
            )}
          />
        </div>
      </header>    
         
      <div className='profile'>
        <Tooltip title={isLoggedIn ? "Account" : "Sign In"}>
          <IconButton size="large" onClick={handleMenuOpen}>
            <AccountCircle sx={{ fontSize: 50, color: isLoggedIn ? '#4caf50' : 'inherit' }}/> 
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >

          {isLoggedIn ? [
            <MenuItem key="profile" onClick={handleOpenProfile}>Profile</MenuItem>, //menu items on login 
            <MenuItem key="signout" onClick={handleSignOut}>Sign Out</MenuItem>
          ] : [
            <MenuItem key="signin" onClick={() => handleOpenDialog('login')}>Sign In</MenuItem>, //menu items when not logged in
            <MenuItem key="signup" onClick={() => handleOpenDialog('register')}>Sign Up</MenuItem>
          ]}
        </Menu>
      </div>


      <Dialog open={authDialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          {dialogMode === 'login' ? 'Sign In to Your Account' : 'Create a New Account'}
        </DialogTitle>
        
        <DialogContent>
          {errorMsg && (
             <Alert severity={errorMsg.includes("successful") ? "success" : "error"} sx={{ mt: 1, mb: 2 }}>
               {errorMsg}
             </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px', justifyContent: 'space-between' /* to switch between login and register dialogs */}}>
          <Button 
            size="small" 
            onClick={() => setDialogMode(dialogMode === 'login' ? 'register' : 'login')}
          >
            {dialogMode === 'login' ? "New User?" : "Already have an account?"}
          </Button>

          <div>
            <Stack direction="row" spacing={2}>

              <Button onClick={handleCloseDialog} variant="contained" color="error">Cancel</Button>
              <Button onClick={handleSubmit} 
                variant="contained" 
                color="primary" 
                disabled={!email.trim() || !password.trim()} //trim to prevent spaces from being considered valid input
              >
                {dialogMode === 'login' ? 'Log In' : 'Sign Up'}
              </Button>

            </Stack>
          </div>
        </DialogActions>
      </Dialog>

      { /* Profile Dialog to show user's saved favorites */ }
      <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ backgroundColor: '#4caf50', color: 'white' }}>
          Profile & Favorites
        </DialogTitle>
        <DialogContent dividers>
          {userFavorites.length === 0 ? ( // if there are no favorites, show the message saying that there are no favorites saved yet
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'gray' }}>
              No favorites saved yet!
            </Typography>
          ) : (
            <List>
              {userFavorites.map((fav, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', pb: 2 }}>
                    
                    {/* Issue - Country Title */}
                    <ListItemText 
                      primary={
                        <Typography sx={{ fontWeight: 'bold', color: '#000080', mb: 1 }}>
                          {`${fav.issue} - ${fav.countryName}`}
                        </Typography>
                      }
                    />
                    
                    {/* Shows snippet of summary data saved from the map */}
                    <Typography variant="body2" color="text.secondary">
                       {fav.data.summary 
                          ? fav.data.summary 
                          // if there's no country summary, find the first string value in the data object (> 20 chars) to show as a snippet in the profile favorites list
                          : Object.values(fav.data).find(val => typeof val === 'string' && val.length > 20)} 
                    </Typography>

                  </ListItem>
                  {index < userFavorites.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)} variant="outlined" sx={{ backgroundColor: '#2c3e50', color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default Dropdown;

