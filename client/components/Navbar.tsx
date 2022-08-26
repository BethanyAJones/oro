import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Box, Grid, Container, AppBar, Tooltip, UseTheme, Divider, Typography, Toolbar, IconButton, Menu, MenuIcon, Button, MenuItem, NightlightIcon, WbSunnyIcon, Badge } from '../styles/material';

import { Home, TravelExplore, MusicNote, Grade, Luggage, PriceChange, Forum, Login, Mail, Logout } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


const Navbar = (props) => {
  const { currentUserInfo, getCurrentUser, logoutUser } = useContext(UserContext);

  const { notif, profile } = props;
  const theme = UseTheme();
  const iconColors = theme.palette.secondary.contrastText;
  const inverseMode = theme.palette.secondary.main;

  const themeContext = useContext(ThemeContext);
  const { mode, toggleMode } = themeContext;

  const navigate = useNavigate();

  const pages = [

    ['/home', <Link
      to='/home'
      style={{ textDecoration: 'none' }}
      key={'home'}
    >
      <Home className='nav-icons'/>
      Home
    </Link>],
    ['/eventListings', <Link
      to='/eventListings'
      style={{ textDecoration: 'none' }}
      key={'eventListings'}
    >
      <TravelExplore className='nav-icons'/>
      Find Events
    </Link>],
    ['/travelPlanner', <Link
      to='/travelPlanner'
      style={{ textDecoration: 'none' }}
      key={'travelPlanner'}
    >
      <Luggage className='nav-icons'/>
      Travel Planner
    </Link>],
    ['/backpack', <Link to='/backpack' style={{ textDecoration: 'none' }} key={'backpack'}>
      <PriceChange className='nav-icons'/>
      Budgets
    </Link>],
    ['/songFinder', <Link to='/songFinder' style={{ textDecoration: 'none' }} key={'songFinder'}>
      <MusicNote className='nav-icons'/>
      Song Finder
    </Link>],
    ['/artists', <Link to='/artists' style={{ textDecoration: 'none' }} key={'artists'}>
      <Grade className='nav-icons'/>
      Favorite Artists
    </Link>]
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page === '/home') {
      logoutUser();
    }
    setAnchorElNav(null);
    navigate(page);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  let isLoggedIn = false;

  if (currentUserInfo.id) {
    isLoggedIn = true;
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  const AccountBlock = () => {
    const account = [
      ['/profile', <Link to='/profile' style={{ textDecoration: 'none' }} key={'profile'}>
        <img src={profile} className='nav-icons avatar'/>Account</Link>],
      ['/chat', <Link to='/chat' style={{ textDecoration: 'none' }} key={'chat'}> <Forum className='nav-icons'/>Chat</Link>],
      ['/notifications', <Link to='/notifications' style={{ textDecoration: 'none' }} key={'notifications'}>
        <Badge badgeContent={notif} color="primary" >
          <Mail className='nav-icons'/>
        </Badge>
        Notifications</Link>]
    ];
    return (account.map((page, index) => (
      <MenuItem key={`nav${index}`} onClick={() => { handleCloseNavMenu(page[0]); }}>
        <Typography variant='h6' textAlign='center'>{page[1]}</Typography>
      </MenuItem>
    )));
  };

  return (
    <AppBar position='sticky' sx={{ bgcolor: inverseMode, paddingRight: '20px' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Grid container>
            <Grid item xs={9} sm={10} style={{ display: 'flex', alignItems: 'left' }}>
              <a href='/'><img src={mode === 'dark' ? 'images/VSLOGO-dark.png' : 'images/VSLOGO.png'} height='75' /></a>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'none', bgcolor: inverseMode }, mr: '5px' }}>
                {pages.map((page, index) => (
                  <Button
                    key={`page${index}`}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page[1]}
                  </Button>
                ))}
              </Box>
            </Grid>
            <Grid item xs={2} sm={1} style={{ display: 'flex' }} sx={{ margin: 'auto' }}>
              <IconButton onClick={toggleMode}>
                {mode === 'dark' ? (
                  <div><Tooltip title='Dark mode'><NightlightIcon fontSize='medium' sx={{ color: iconColors }} /></Tooltip>
                  </div>
                ) : (
                  <div><Tooltip title='Light mode'><WbSunnyIcon fontSize='medium' sx={{ color: iconColors }} /></Tooltip>
                  </div>
                )}
              </IconButton>
            </Grid>
            <Grid item xs={1} style={{ display: 'flex' }} sx={{ margin: 'auto' }}>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
              >
                <MenuIcon sx={{ color: iconColors }} fontSize='large' />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'block', lg: 'block' },
                }}
              >
                {pages.map((page, index) => (
                  <MenuItem key={`nav${index}`} onClick={() => { handleCloseNavMenu(page[0]); }}>
                    <Typography variant='h6' textAlign='center'>{page[1]}</Typography>
                  </MenuItem>
                ))}
                <Divider style={{width: '100%', height: '1%'}} sx={{ borderColor: iconColors, opacity: 0.2 }}/>
                {
                  isLoggedIn
                    ? <>{AccountBlock()}
                      <MenuItem onClick={() => { isLoggedIn ? handleCloseNavMenu('/home') : handleCloseNavMenu('/login'); }}>
                        <Link to='/home' style={{ textDecoration: 'none' }} key={'logout'} onClick={logoutUser}>
                          <Logout className='nav-icons'/>
                          Logout
                        </Link>
                      </MenuItem>
                    </>
                    :
                    <MenuItem onClick={() => { isLoggedIn ? handleCloseNavMenu('/home') : handleCloseNavMenu('/login'); }}>
                      <Link to='/login' style={{ textDecoration: 'none' }} key={'login'}>
                        <Login className='nav-icons'/>
                          Login
                      </Link>
                    </MenuItem>
                }
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
