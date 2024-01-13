import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>My App</h1>
        </Link>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color="inherit">Sign In</Button>
          </Link>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
