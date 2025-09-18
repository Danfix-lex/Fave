
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  ArrowForward,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'authenticated'
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling auth callback...');
        console.log('Current URL:', window.location.href);
        console.log('URL hash:', window.location.hash);
        console.log('URL search params:', window.location.search);
        
        // Check if this is a Supabase auth callback with token in query params
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        
        console.log('Token from URL:', token);
        console.log('Type from URL:', type);
        
        if (token && type === 'signup') {
          console.log('Processing Supabase email verification token...');
          
          // Use the correct method for email verification
          const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token: token,
            type: 'signup'
          });
          
          console.log('Email verification result:', verifyData, verifyError);
          
          if (verifyError) {
            console.error('Email verification error:', verifyError);
            setError(`Email verification failed: ${verifyError.message}`);
            setStatus('error');
            return;
          }
          
          if (verifyData?.user?.email_confirmed_at) {
            console.log('User verified successfully:', verifyData.user.email);
            setUserEmail(verifyData.user.email);
            setStatus('authenticated');
            
            // Update user record
            try {
              const { error: dbError } = await supabase
                .from('users')
                .upsert([{
                  id: verifyData.user.id,
                  email: verifyData.user.email,
                  role: 'fan',
                  is_kyc_complete: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }], {
                  onConflict: 'id'
                });

              if (dbError) {
                console.error('Database error:', dbError);
              } else {
                console.log('User record updated in database');
              }
            } catch (dbError) {
              console.error('Database error during user update:', dbError);
            }
            
            // Show success message for 3 seconds, then redirect to sign-in
            setTimeout(() => {
              setShowRedirectMessage(true);
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            }, 3000);
            
            return;
          } else {
            console.log('Verification succeeded but user not confirmed');
            setError('Email verification completed but user confirmation failed. Please try signing in.');
            setStatus('error');
            return;
          }
        }
        
        // If no token found, show error
        if (!token || type !== 'signup') {
          setError('Invalid verification link. Please check your email and try again.');
          setStatus('error');
          return;
        }
        
        // This should not be reached if token verification worked above
        setError('Email verification failed. Please check your email and try again.');
        setStatus('error');
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred. Please try again.');
        setStatus('error');
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        console.log('User signed in and verified via auth state change');
        setUserEmail(session.user.email);
        setStatus('authenticated');
        
        // User record should already exist from signup, just update if needed
        try {
          const { error: dbError } = await supabase
            .from('users')
            .upsert([{
              id: session.user.id,
              email: session.user.email,
              role: 'fan', // Default role, will be updated in KYC
              is_kyc_complete: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }], {
              onConflict: 'id'
            });

          if (dbError) {
            console.error('Database error:', dbError);
          } else {
            console.log('User record updated in database');
          }
        } catch (dbError) {
          console.error('Database error during user update:', dbError);
        }
        
        // Show success message for 3 seconds, then redirect to sign-in
        setTimeout(() => {
          setShowRedirectMessage(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }, 3000);
      } else if (event === 'SIGNED_OUT') {
        setError('Session expired. Please sign in again.');
        setStatus('error');
      }
    });

    // Check current status
    handleAuthCallback();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleRetry = () => {
    navigate('/login');
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

  const getStatusContent = () => {
    switch (status) {
      case 'verifying':
        return {
          icon: <CircularProgress size={60} sx={{ color: 'primary.main' }} />,
          title: 'Verifying Your Email...',
          message: 'Please wait while we confirm your email address.',
          color: 'primary.main',
        };
      case 'authenticated':
        return {
          icon: <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />,
          title: 'Email Verified Successfully!',
          message: `Your email ${userEmail} has been confirmed and you are now authenticated.`,
          color: 'success.main',
        };
      case 'success':
        return {
          icon: <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />,
          title: 'Email Verified Successfully!',
          message: 'Your email has been confirmed. Redirecting to your dashboard...',
          color: 'success.main',
        };
      case 'error':
        return {
          icon: <Error sx={{ fontSize: 60, color: 'error.main' }} />,
          title: 'Verification Failed',
          message: error || 'There was an issue verifying your email. Please try again.',
          color: 'error.main',
        };
      default:
        return {
          icon: <CircularProgress size={60} sx={{ color: 'primary.main' }} />,
          title: 'Processing...',
          message: 'Please wait...',
          color: 'primary.main',
        };
    }
  };

  const statusContent = getStatusContent();

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
                {statusContent.icon}
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
                {statusContent.title}
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
                {statusContent.message}
              </Typography>

              {status === 'error' && (
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ArrowForward />}
                    onClick={handleRetry}
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
                    Try Again
                  </Button>
                </Box>
              )}

              {status === 'authenticated' && !showRedirectMessage && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Preparing your account...
                  </Typography>
                </Box>
              )}

              {status === 'authenticated' && showRedirectMessage && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                    Redirecting you to the sign-in page...
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ArrowForward />}
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #047857, #065f46)',
                      },
                    }}
                  >
                    Sign In Now
                  </Button>
                </Box>
              )}

              {status === 'success' && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    You will be redirected automatically...
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default EmailConfirmation;
