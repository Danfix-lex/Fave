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
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  ArrowForward,
  MusicNote,
  People,
  TrendingUp,
  Security,
  Star,
  PlayArrow,
  AttachMoney,
  Public,
  Diamond,
  AutoAwesome,
  Verified,
  Timeline,
  MonetizationOn,
} from '@mui/icons-material';

const features = [
  {
    icon: MusicNote,
    title: "Tokenize Your Art",
    description: "Transform your creative work into tradeable tokens. Musicians, authors, and filmmakers can monetize their future royalties today.",
    color: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
  {
    icon: People,
    title: "Fan-Powered Funding", 
    description: "Fans become investors in your success. Buy tokens, support creators, and earn from their future achievements.",
    color: "linear-gradient(135deg, #a855f7, #7c3aed)",
  },
  {
    icon: TrendingUp,
    title: "Smart Revenue Sharing",
    description: "Blockchain-powered automatic distribution. Every stream, sale, or view generates returns for token holders.", 
    color: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    icon: Security,
    title: "Bank-Grade Security",
    description: "KYC verification, encrypted transactions, and secure smart contracts protect every investment.",
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
  }
];

const stats = [
  { number: "10K+", label: "Active Creators", icon: MusicNote },
  { number: "50K+", label: "Fan Investors", icon: People },
  { number: "$2M+", label: "Tokens Traded", icon: AttachMoney },
  { number: "15+", label: "Countries", icon: Public },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Independent Musician",
    content: "Fave changed everything for me. I could finally fund my album without giving up creative control. My fans are now my biggest supporters!",
    avatar: "SJ",
  },
  {
    name: "Marcus Chen",
    role: "Fan Investor",
    content: "I've been following my favorite artist for years. Now I'm not just a fan - I'm an investor in their success. The returns have been incredible!",
    avatar: "MC",
  },
  {
    name: "Elena Rodriguez",
    role: "Film Director",
    content: "Getting funding for indie films was always a struggle. Fave connected me with fans who believed in my vision. Game changer!",
    avatar: "ER",
  },
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
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={<AutoAwesome />}
                    label="Revolutionary Platform"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 4,
                    color: 'white',
                    textAlign: 'center',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    lineHeight: 1.1,
                  }}
                >
                  Where Fans Become{' '}
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
                    Investors
                  </Typography>
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 2,
                    maxWidth: '800px',
                    mx: 'auto',
                    lineHeight: 1.3,
                    fontWeight: 600,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                  }}
                >
                  The Future of Creative Funding is Here
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 6,
                    maxWidth: '900px',
                    mx: 'auto',
                    lineHeight: 1.7,
                    fontWeight: 400,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                  }}
                >
                  Transform your creative work into tradeable tokens. Fans invest in your success, 
                  you keep creative control, and everyone wins when your art succeeds. 
                  <br />
                  <strong>No more gatekeepers. No more middlemen. Just pure creative freedom.</strong>
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

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={stat.label}>
                  <motion.div variants={itemVariants}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                        }}
                      >
                        <stat.icon sx={{ fontSize: 32, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          mb: 1,
                          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500,
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
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
              Why Choose Fave?
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
              The most innovative platform for creators and fans to connect through tokenized investments
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
                            background: feature.color,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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

      {/* Testimonials Section */}
      <Box sx={{ 
        py: { xs: 10, md: 15 }, 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
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
                  What Our Community Says
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    maxWidth: '600px', 
                    mx: 'auto',
                    fontWeight: 400,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Real stories from creators and fans who are already winning with Fave
                </Typography>
              </motion.div>
            </Box>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={testimonial.name}>
                  <motion.div variants={cardVariants}>
                    <Card
                      sx={{
                        height: '100%',
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                              mr: 2,
                              fontWeight: 600,
                              fontSize: '1.25rem',
                            }}
                          >
                            {testimonial.avatar}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: 'white',
                                mb: 0.5,
                              }}
                            >
                              {testimonial.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: 1.7,
                            fontStyle: 'italic',
                            fontSize: '1.1rem',
                          }}
                        >
                          "{testimonial.content}"
                        </Typography>
                        <Box sx={{ display: 'flex', mt: 2 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                          ))}
                        </Box>
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
                Ready to Transform Your Creative Journey?
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h5"
                sx={{ 
                  mb: 2, 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                Join thousands of creators and fans already winning with Fave
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{ 
                  mb: 6, 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                Start your journey today. No gatekeepers. No middlemen. Just pure creative freedom.
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
            Start Your Journey Now
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
