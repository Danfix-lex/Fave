import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Person,
  MusicNote,
  Info,
  ContactMail,
  TrendingUp,
  Login as LoginIcon,
  PersonAdd,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = user ? [
    // Authenticated users - no home button, dashboard-focused navigation
    { name: 'Dashboard', href: '/dashboard', icon: TrendingUp },
    { name: 'Upcoming Songs', href: '/upcoming', icon: MusicNote },
    { name: 'Profile', href: '/profile', icon: Person },
  ] : [
    // Unauthenticated users - full navigation including home
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Upcoming Songs', href: '/upcoming', icon: TrendingUp },
    { name: 'Contact', href: '/contact', icon: ContactMail },
  ];

  const authItems = [
    { name: 'Sign In', href: '/login', icon: LoginIcon },
    { name: 'Sign Up', href: '/signup', icon: PersonAdd },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            Fave
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      
      <List sx={{ p: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.href}
              selected={location.pathname === item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.50',
                  '&:hover': {
                    backgroundColor: 'primary.100',
                  },
                },
              }}
            >
              <ListItemIcon>
                <item.icon color={location.pathname === item.href ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.href ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        {authItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.href}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                backgroundColor: item.name === 'Sign Up' ? 'primary.main' : 'transparent',
                color: item.name === 'Sign Up' ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: item.name === 'Sign Up' ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon>
                <item.icon color={item.name === 'Sign Up' ? 'inherit' : 'inherit'} />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const userAvatarUrl = user?.user_metadata?.avatar_url
    || user?.user_metadata?.picture
    || user?.identities?.[0]?.identity_data?.picture
    || null;

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
            }}
          >
            Fave
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 3 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.href}
                startIcon={<item.icon />}
                color="inherit"
                sx={{
                  fontWeight: location.pathname === item.href ? 600 : 400,
                  backgroundColor: location.pathname === item.href ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Desktop Auth Buttons / User Avatar */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  color="inherit"
                  sx={{ fontWeight: 500 }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  startIcon={<PersonAdd />}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                  <Avatar src={userAvatarUrl || undefined} alt={user?.email || 'User'} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>Dashboard</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profile</MenuItem>
                  <Divider />
                  <MenuItem onClick={async () => { handleMenuClose(); await signOut(); navigate('/'); }}>Sign out</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
