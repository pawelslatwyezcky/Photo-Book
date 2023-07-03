import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import * as actionType from '../../constants/actionTypes';
import logo from '../../images/logo.jpg';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    navigate('/auth');
    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]); //react-hooks/exhaustive-deps

  return (
    <AppBar
      className="navbar__appbar"
      style={{
        borderRadius: 15,
        margin: '30px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        padding: '10px 50px',
      }}
      position="static"
      color="inherit"
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img component={Link} src={logo} alt="Icon" height="60px" />
      </Link>
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'space-between' : 'flex-end',
          width: isMobile ? 'auto' : '400px',
        }}
      >
        {user?.result ? (
          <div
            className="navbar__profile__info"
            style={{
              display: 'flex',
              justifyContent: isMobile ? 'center' : 'flex-end',
              width: isMobile ? '85vw' : '400px',
              maxWidth: '85vw',
              alignItems: 'center',
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            <Avatar
              style={{
                color: theme.palette.getContrastText(deepPurple[500]),
                backgroundColor: deepPurple[500],
                width: isMobile ? '30px' : '40px',
                height: isMobile ? '30px' : '40px',
                fontSize: isMobile ? '16px' : '20px',
                fontFamily: 'Monoton',
              }}
              alt={user.result.name}
              src={user.result.imageUrl}
            >
              {' '}
              {user.result.name.charAt(0)}{' '}
            </Avatar>
            <Typography
              style={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 15px',
                fontSize: isMobile ? '16px' : '20px',
                fontFamily: 'Orbitron',
                fontWeight: '900',
              }}
              variant="h6"
            >
              {isMobile
                ? `${user.result.name.charAt(0)}. ${
                    user.result.name.split(' ')[1]
                  }`
                : user.result.name}
            </Typography>
            <Button variant="contained" color="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            {' '}
            Sign In{' '}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
