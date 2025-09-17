import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Refresh,
  ArrowForward,
  Security,
  Timer,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get email and role from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
      setRole(location.state.role);
    } else {
      // If no state, try to get from current session
      const getCurrentUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setEmail(session.user.email);
          setRole('fan'); // Default role
        } else {
          // If no session, redirect to signup
          navigate('/signup');
          return;
        }
      };
      getCurrentUser();
    }

    // Check if user is already verified
    checkVerificationStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        // User is verified, redirect to dashboard
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const checkVerificationStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setResendSuccess(true);
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      setError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session?.user?.email_confirmed_at) {
        navigate('/dashboard');
      } else {
        setError('Email not yet verified. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

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

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
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
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Email sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography
                variant="h3"
                component="h1"
                sx={{ 
                  fontWeight: 700, 
                  mb: 2, 
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Verify Your Email
              </Typography>
              
              <Typography
                variant="h6"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  mb: 2,
                }}
              >
                We've sent a verification link to
              </Typography>
              
              <Typography
                variant="h6"
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                {email}
              </Typography>
            </Box>

            {/* Instructions */}
            <motion.div variants={cardVariants}>
              <Card
                sx={{
                  p: 3,
                  mb: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                    Next Steps:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      >
                        1
                      </Box>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Check your email inbox (and spam folder)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      >
                        2
                      </Box>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Click the verification link in the email
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: 'white',
                        }}
                      >
                        3
                      </Box>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Return here to complete your {role} account setup
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Error/Success Messages */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {resendSuccess && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Verification email sent! Please check your inbox.
              </Alert>
            )}

            {/* Action Buttons */}
            <motion.div variants={cardVariants}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isVerifying}
                  startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                  onClick={handleCheckVerification}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                    },
                  }}
                >
                  {isVerifying ? 'Checking...' : 'I\'ve Verified My Email'}
                </Button>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Didn't receive the email?
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  disabled={isResending || countdown > 0}
                  startIcon={isResending ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  onClick={handleResendEmail}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {isResending 
                    ? 'Sending...' 
                    : countdown > 0 
                      ? `Resend in ${countdown}s` 
                      : 'Resend Verification Email'
                  }
                </Button>
              </Box>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={cardVariants}>
              <Alert 
                severity="info" 
                icon={<Security />} 
                sx={{ 
                  mt: 4, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white' }}>
                  Security Notice
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                  The verification link will expire in 24 hours. If you don't see the email, 
                  please check your spam folder or contact support.
                </Typography>
              </Alert>
            </motion.div>

            {/* Back to Login */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Already verified?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in here
                </Button>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VerifyEmail;
