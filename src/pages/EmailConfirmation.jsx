
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
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setStatus('error');
          return;
        }

        // If we have a session and user is verified, redirect to dashboard
        if (data.session?.user?.email_confirmed_at) {
          console.log('User verified and signed in:', data.session.user.email);
          setStatus('success');
          
          // Create user record in database if it doesn't exist
          try {
            const { error: dbError } = await supabase
              .from('users')
              .upsert([{
                id: data.session.user.id,
                email: data.session.user.email,
                role: 'fan', // Default role, will be updated in KYC
                is_kyc_complete: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }], {
                onConflict: 'id'
              });

            if (dbError) {
              console.error('Database error:', dbError);
              // Don't fail the flow for database errors
            } else {
              console.log('User record created/updated in database');
            }
          } catch (dbError) {
            console.error('Database error during user creation:', dbError);
          }

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Check if user exists but not verified
          if (data.session?.user && !data.session.user.email_confirmed_at) {
            setError('Email not yet verified. Please check your email and click the verification link.');
            setStatus('error');
          } else {
            setError('No active session. Please sign up again.');
            setStatus('error');
          }
        }
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
        setStatus('success');
        
        // Create user record in database
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
            console.log('User record created/updated in database');
          }
        } catch (dbError) {
          console.error('Database error during user creation:', dbError);
        }
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
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
