import React from 'react';
import { AppBar, Toolbar, Typography, TextField, InputAdornment, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function Navbar({ searchValue, onSearchChange, placeholder }) {
  const navigate = useNavigate();
  
  // Retrieve the username from local storage
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    // Clear user data and tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_name');
    
    // Redirect to the login page or home page
    navigate('/login'); // Adjust the path as needed
  };

  const handleTitleClick = () => {
    navigate('/'); // Redirect to the home page when "Nextacts" is clicked
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          style={{ 
            width: '10%', 
            minWidth: 'auto', // Prevent default min-width of button
            marginLeft: 'auto', // Push button to the right
            textAlign: 'center' // Center text inside button
          }} 
          onClick={handleTitleClick} // Add click handler
        >
          Nextacts
        </Typography>
        <Box style={{ flexGrow: 2, display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            placeholder={placeholder}
            value={searchValue}
            onChange={onSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ width: '70%', margin:'auto' }} // Make search bar occupy full space of its container
          />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <Button 
            color="inherit" 
            onClick={handleLogout} 
            style={{ 
              width: 'auto', 
              minWidth: 'auto', // Prevent default min-width of button
              textAlign: 'center' // Center text inside button
            }}
          >
            Logout{userName ? ` (${userName})` : ''}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
