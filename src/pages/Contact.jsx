import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  Message,
  Business,
} from '@mui/icons-material';

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
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

  const contactInfo = [
    {
      icon: Email,
      title: 'Email Us',
      description: 'Send us an email anytime',
      contact: 'hello@fave.com',
      color: 'primary',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 5pm',
      contact: '+1 (555) 123-4567',
      color: 'success',
    },
    {
      icon: LocationOn,
      title: 'Visit Us',
      description: 'Come say hello at our office',
      contact: 'San Francisco, CA',
      color: 'secondary',
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
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Get in Touch
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                Have questions about Fave? Want to partner with us? 
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    mb: 4,
                    fontWeight: 600,
                  }}
                >
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <Card
                        sx={{
                          p: 3,
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
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                backgroundColor: `${info.color}.main`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                              }}
                            >
                              <info.icon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: 'white',
                                  fontWeight: 600,
                                  mb: 0.5,
                                }}
                              >
                                {info.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                {info.description}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'white',
                              fontWeight: 500,
                            }}
                          >
                            {info.contact}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    p: { xs: 4, md: 6 },
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        mb: 4,
                        fontWeight: 600,
                      }}
                    >
                      Send us a Message
                    </Typography>

                    {success && (
                      <Alert
                        severity="success"
                        sx={{ mb: 3, borderRadius: 2 }}
                      >
                        Thank you for your message! We'll get back to you soon.
                      </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="name"
                            label="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            name="email"
                            type="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="subject"
                            label="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            name="message"
                            label="Message"
                            multiline
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&.Mui-focused': {
                                  color: 'primary.main',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              fullWidth
                              disabled={loading}
                              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                              sx={{
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                                  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                                },
                              }}
                            >
                              {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;
