import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
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
  Chip,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Home,
  Person,
  Add,
  AccountBalanceWallet,
  Settings,
  Logout,
  MusicNote,
  People,
  BarChart,
  Security,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getNavigationItems = () => {
    if (!userProfile) return [];

    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Profile', href: '/profile', icon: Person },
    ];

    if (userProfile.role === 'creator') {
      return [
        ...baseItems,
        { name: 'My Projects', href: '/projects', icon: MusicNote },
        { name: 'Create Project', href: '/projects/create', icon: Add },
        { name: 'Revenue', href: '/revenue', icon: BarChart },
      ];
    }

    if (userProfile.role === 'fan') {
      return [
        ...baseItems,
        { name: 'Browse Projects', href: '/browse', icon: MusicNote },
        { name: 'My Portfolio', href: '/portfolio', icon: AccountBalanceWallet },
        { name: 'Transactions', href: '/transactions', icon: BarChart },
      ];
    }

    if (userProfile.role === 'admin') {
      return [
        ...baseItems,
        { name: 'Users', href: '/admin/users', icon: People },
        { name: 'Projects', href: '/admin/projects', icon: MusicNote },
        { name: 'Transactions', href: '/admin/transactions', icon: BarChart },
        { name: 'Approvals', href: '/admin/approvals', icon: Security },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          component={Link}
          to="/dashboard"
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
      </Box>
      <List sx={{ p: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.href}
              selected={location.pathname === item.href}
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
      </List>
    </Box>
  );

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(15, 23, 42, 0.8)',
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
            to="/dashboard"
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

          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {userProfile?.profile?.full_name || user.email}
              </Typography>
              <Chip
                label={userProfile?.role}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Button
              onClick={handleSignOut}
              startIcon={<Logout />}
              color="inherit"
              sx={{ fontWeight: 500 }}
            >
              Sign Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  );
};

export default Layout;