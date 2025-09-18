import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowForward,
  MusicNote,
  People,
  TrendingUp,
  Security,
} from '@mui/icons-material';

const features = [
  {
    icon: MusicNote,
    title: "Create Projects",
    description: "Musicians, authors, and filmmakers tokenize their future royalties",
  },
  {
    icon: People,
    title: "Fan Investment", 
    description: "Fans buy tokens representing ownership in future royalty streams",
  },
  {
    icon: TrendingUp,
    title: "Revenue Sharing",
    description: "Automated distribution of royalties based on token ownership", 
  },
  {
    icon: Security,
    title: "Secure Platform",
    description: "KYC verification and secure payment processing for all users",
  }
];

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle clicks for unauthenticated users
  const handleUnauthenticatedClick = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
      }}
    >

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)',
          py: { xs: 10, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    color: 'white',
                    textAlign: 'center',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  Tokenize Your{' '}
                  <Typography
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #60a5fa, #c084fc, #fbbf24)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradientShift 3s ease-in-out infinite',
                      '@keyframes gradientShift': {
                        '0%, 100%': {
                          background: 'linear-gradient(135deg, #60a5fa, #c084fc)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                        },
                        '50%': {
                          background: 'linear-gradient(135deg, #c084fc, #fbbf24)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                        },
                      },
                    }}
                  >
                Creative Future
                  </Typography>
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 6,
                    maxWidth: '900px',
                    mx: 'auto',
                    lineHeight: 1.7,
                    fontWeight: 400,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
              The first platform where creators can sell future royalties as tokens to fans who believe in their work. 
              Fund your projects, reward your supporters.
                </Typography>
              </motion.div>

              <motion.div
                variants={itemVariants}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: '16px',
                  justifyContent: 'center',
                }}
              >
                <Button
                  component={Link}
                  to="/signup?role=creator"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                      boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
              >
                I'm a Creator
                </Button>
                <Button
                  component={Link}
                to="/signup?role=fan"
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 2,
                    px: 6,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'white',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
              >
                I'm a Fan/Investor
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: { xs: 10, md: 15 }, 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
      }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3, 
                    color: 'white',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
              How Fave Works
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    maxWidth: '700px', 
                    mx: 'auto',
                    fontWeight: 400,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
              A revolutionary platform connecting creators and fans through tokenized royalties
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4}>
            {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={feature.title}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                    style={{ height: '100%' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 4,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 4,
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 3,
                            background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <feature.icon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography
                          variant="h5"
                          component="h3"
                          sx={{ 
                            fontWeight: 600, 
                            mb: 3, 
                            color: 'white',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                          }}
                        >
                    {feature.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)', 
                            lineHeight: 1.7,
                            fontSize: { xs: '1rem', sm: '1.125rem' },
                          }}
                        >
                    {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 12, md: 16 },
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ textAlign: 'center' }}
          >
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                component="h2"
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
            Ready to Get Started?
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h5"
                sx={{ 
                  mb: 6, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
            Join the future of creative funding and fan engagement
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                component={Link}
            to="/signup"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                  sx={{
                    py: 3,
                    px: 8,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7, #fbbf24)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8, #7c3aed, #f59e0b)',
                      boxShadow: '0 16px 50px rgba(59, 130, 246, 0.5)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
          >
            Create Your Account
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
