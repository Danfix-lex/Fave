import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  MusicNote,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: LinkedIn, href: '#', label: 'LinkedIn' },
    { icon: YouTube, href: '#', label: 'YouTube' },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Upcoming Songs', href: '/upcoming' },
    { name: 'Contact', href: '/contact' },
    { name: 'Sign In', href: '/login' },
    { name: 'Sign Up', href: '/signup' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Refund Policy', href: '/refunds' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Musical background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    component={Link}
                    to="/"
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <MusicNote sx={{ mr: 1, fontSize: 32 }} />
                    Fave
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.7,
                      mb: 3,
                    }}
                  >
                    The revolutionary platform where creators can tokenize their future royalties 
                    and fans can invest in the music they love. Join the future of creative funding.
                  </Typography>
                </Box>

                {/* Contact Info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      hello@fave.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      +234 9016614219
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Lagos,Nigeria.
                    </Typography>
                  </Box>
                </Box>

                {/* Social Links */}
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {socialLinks.map((social) => (
                      <motion.div
                        key={social.label}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          component="a"
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: 'primary.main',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <social.icon />
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Quick Links
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {quickLinks.map((link) => (
                    <Typography
                      key={link.name}
                      component={Link}
                      to={link.href}
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {link.name}
                    </Typography>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Legal Links */}
            <Grid item xs={12} sm={6} md={2}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Legal
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {legalLinks.map((link) => (
                    <Typography
                      key={link.name}
                      component={Link}
                      to={link.href}
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {link.name}
                    </Typography>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Stay Updated
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 3,
                    lineHeight: 1.6,
                  }}
                >
                  Subscribe to our newsletter for the latest updates on upcoming songs, 
                  new features, and exclusive content.
                </Typography>
                <Box
                  component="form"
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <Box
                    component="input"
                    placeholder="Enter your email"
                    sx={{
                      flex: 1,
                      p: 2,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                      '&:focus': {
                        outline: 'none',
                        borderColor: 'primary.main',
                      },
                    }}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Box
                      component="button"
                      type="submit"
                      sx={{
                        p: 2,
                        px: 4,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        border: 'none',
                        borderRadius: 2,
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      Subscribe
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Copyright */}
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                © 2025 Fave. All rights reserved.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Made with ❤️ for creators and fans
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;
