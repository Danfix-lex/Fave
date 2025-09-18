import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Email,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Get email and role from navigation state
    if (location.state) {
      setEmail(location.state.email || '');
      setRole(location.state.role || '');
    }
  }, [location.state]);

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

  const handleResendEmail = () => {
    // TODO: Implement resend email functionality
    console.log('Resend email requested for:', email);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: 4,
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ mb: 4 }}>
                <Email sx={{ fontSize: 80, color: 'primary.main' }} />
              </Box>
              
              <Typography
                variant={isMobile ? 'h4' : 'h3'}
                component="h1"
                sx={{ 
                  fontWeight: 700, 
                  mb: 3, 
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Check Your Email
              </Typography>
              
              <Typography
                variant="h6"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                We've sent a verification link to <strong>{email}</strong>
              </Typography>

              <Typography
                variant="body1"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Please check your email and click the verification link to complete your {role} account setup.
              </Typography>

              <Box sx={{ 
                p: 3, 
                bgcolor: 'rgba(59, 130, 246, 0.1)', 
                borderRadius: 2, 
                mb: 4,
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
                  📧 What's Next?
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                  1. Check your email inbox (and spam folder)
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
                  2. Click the verification link in the email
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  3. You'll be redirected back to sign in
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleResendEmail}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    },
                  }}
                >
                  Resend Verification Email
                </Button>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ArrowForward />}
                  onClick={handleGoToLogin}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                    },
                  }}
                >
                  Go to Sign In
                </Button>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Didn't receive the email? Check your spam folder or try resending.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VerifyEmail;