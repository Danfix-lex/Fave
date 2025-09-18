import React from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  MusicNote,
  TrendingUp,
  Security,
  People,
  Star,
  EmojiEvents,
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const stats = [
    { number: '10K+', label: 'Active Creators', icon: MusicNote },
    { number: '50K+', label: 'Fan Investors', icon: People },
    { number: '$2M+', label: 'Total Raised', icon: TrendingUp },
    { number: '95%', label: 'Success Rate', icon: Star },
  ];

  const values = [
    {
      icon: MusicNote,
      title: 'Empowering Creators',
      description: 'We believe every creator deserves the opportunity to fund their dreams and connect directly with their fans.',
      color: 'primary',
    },
    {
      icon: People,
      title: 'Community First',
      description: 'Building a vibrant community where creators and fans can collaborate and support each other.',
      color: 'success',
    },
    {
      icon: Security,
      title: 'Transparent & Secure',
      description: 'Using blockchain technology to ensure transparent, secure, and fair transactions for everyone.',
      color: 'warning',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Constantly innovating to provide the best tools and features for our growing community.',
      color: 'secondary',
    },
  ];

  const team = [
    {
      name: 'Stephen Omotoso',
      role: 'Frontend Developer',
      image: '/work picture.jpg',
      description: 'Former music industry executive with 15+ years of experience in artist development.',
    },
    {
      name: 'Ojo Daniel',
      role: 'UI/UX Designer',
      image: '/Daniel.jpg',
      description: 'Experienced the ',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Smart Contract Developer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      description: 'UX designer and product strategist focused on creating intuitive user experiences.',
    },
    {
      name: 'David Kim',
      role: 'Backend Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      description: 'Marketing veteran with expertise in growth hacking and community building.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                About Fave
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.7,
                  mb: 6,
                }}
              >
                We're revolutionizing the music industry by creating a platform where creators 
                can tokenize their future royalties and fans can invest in the music they love.
              </Typography>
            </motion.div>
          </Box>

          {/* Stats Section */}
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  mb: 6,
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Our Impact
              </Typography>
            </motion.div>
            <Grid container spacing={4}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={stat.label}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
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
                          <stat.icon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            color: 'white',
                            mb: 1,
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
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Mission Section */}
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      mb: 4,
                      fontWeight: 600,
                    }}
                  >
                    Our Mission
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.7,
                      mb: 4,
                      fontSize: '1.1rem',
                    }}
                  >
                    To democratize the music industry by giving creators direct access to funding 
                    and fans the opportunity to invest in the artists they believe in. We're building 
                    a future where talent, not connections, determines success.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.7,
                      fontSize: '1.1rem',
                    }}
                  >
                    Through blockchain technology and smart contracts, we ensure transparent, 
                    secure, and fair transactions that benefit both creators and investors.
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      p: 4,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 4,
                    }}
                  >
                    <CardContent sx={{ p: 0, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 4,
                          background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <EmojiEvents sx={{ fontSize: 48, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          color: 'white',
                          mb: 2,
                          fontWeight: 600,
                        }}
                      >
                        Join the Revolution
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          lineHeight: 1.6,
                        }}
                      >
                        Be part of the future of music funding. Whether you're a creator looking 
                        to fund your next project or a fan wanting to support your favorite artists, 
                        Fave is your platform.
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* Values Section */}
          <Box sx={{ mb: { xs: 8, md: 12 } }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  mb: 6,
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Our Values
              </Typography>
            </motion.div>
            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={value.title}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0, textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 3,
                            backgroundColor: `${value.color}.main`,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <value.icon sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            mb: 2,
                            fontWeight: 600,
                          }}
                        >
                          {value.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.6,
                          }}
                        >
                          {value.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  mb: 6,
                  textAlign: 'center',
                  fontWeight: 600,
                }}
              >
                Meet Our Team
              </Typography>
            </motion.div>
            <Grid container spacing={4}>
              {team.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={member.name}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card
                      sx={{
                        p: 4,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0, textAlign: 'center' }}>
                        <Avatar
                          src={member.image}
                          sx={{
                            width: 120,
                            height: 120,
                            mx: 'auto',
                            mb: 3,
                            border: '3px solid rgba(255, 255, 255, 0.2)',
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            mb: 1,
                            fontWeight: 600,
                          }}
                        >
                          {member.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'primary.main',
                            mb: 2,
                            fontWeight: 500,
                          }}
                        >
                          {member.role}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.6,
                          }}
                        >
                          {member.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default About;
