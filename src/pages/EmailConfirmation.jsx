
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
          
          // Try different verification methods
          let verifyData = null;
          let verifyError = null;
          
          // Method 1: Try verifyOtp with token_hash
          try {
            const result1 = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'signup'
            });
            verifyData = result1.data;
            verifyError = result1.error;
            console.log('Method 1 (token_hash) result:', verifyData, verifyError);
          } catch (err) {
            console.log('Method 1 failed:', err.message);
          }
          
          // Method 2: Try verifyOtp with token (not token_hash)
          if (verifyError) {
            try {
              const result2 = await supabase.auth.verifyOtp({
                token: token,
                type: 'signup'
              });
              verifyData = result2.data;
              verifyError = result2.error;
              console.log('Method 2 (token) result:', verifyData, verifyError);
            } catch (err) {
              console.log('Method 2 failed:', err.message);
            }
          }
          
          // Method 3: Try verifyOtp with email and token
          if (verifyError) {
            try {
              // Extract email from token if possible, or use a placeholder
              const result3 = await supabase.auth.verifyOtp({
                email: 'user@example.com', // This might need to be the actual email
                token: token,
                type: 'signup'
              });
              verifyData = result3.data;
              verifyError = result3.error;
              console.log('Method 3 (email + token) result:', verifyData, verifyError);
            } catch (err) {
              console.log('Method 3 failed:', err.message);
            }
          }
          
          console.log('Final verify response:', verifyData);
          console.log('Final verify error:', verifyError);
          
          if (verifyError) {
            console.error('Email verification error:', verifyError);
            setError(`Email verification failed: ${verifyError.message}`);
            setStatus('error');
            return;
          }
          
          if (verifyData?.user?.email_confirmed_at) {
            console.log('User verified successfully:', verifyData.user.email);
            setStatus('success');
            
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
            
            setTimeout(() => navigate('/dashboard'), 2000);
            return;
          } else {
            console.log('Verification succeeded but user not confirmed');
            setError('Email verification completed but user confirmation failed. Please try signing in.');
            setStatus('error');
            return;
          }
        }
        
        // Fallback: Check for URL hash with access_token (OAuth flow)
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('Processing URL hash for auth tokens...');
          const { data: hashData, error: hashError } = await supabase.auth.getSession();
          
          if (hashError) {
            console.error('Hash processing error:', hashError);
            setError(hashError.message);
            setStatus('error');
            return;
          }
          
          if (hashData.session?.user?.email_confirmed_at) {
            console.log('User verified from hash:', hashData.session.user.email);
            setStatus('success');
            
            // Update user record
            try {
              const { error: dbError } = await supabase
                .from('users')
                .upsert([{
                  id: hashData.session.user.id,
                  email: hashData.session.user.email,
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
            
            setTimeout(() => navigate('/dashboard'), 2000);
            return;
          }
        }
        
        // Fallback: Handle the auth callback from URL hash
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Session data:', data);
        console.log('Session error:', error);
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setStatus('error');
          return;
        }
        
        // If we have a token but no session, try to process it as a direct verification
        if (token && !data.session) {
          console.log('Token found but no session, trying direct verification...');
          
          // Try to verify the token directly
          try {
            const { data: directVerify, error: directError } = await supabase.auth.verifyOtp({
              token: token,
              type: 'signup'
            });
            
            console.log('Direct verification result:', directVerify, directError);
            
            if (directVerify?.user?.email_confirmed_at) {
              console.log('Direct verification successful');
              setStatus('success');
              setTimeout(() => navigate('/dashboard'), 2000);
              return;
            }
          } catch (directErr) {
            console.log('Direct verification failed:', directErr.message);
          }
        }

        // If we have a session and user is verified, redirect to dashboard
        if (data.session?.user?.email_confirmed_at) {
          console.log('User verified and signed in:', data.session.user.email);
          setStatus('success');
          
          // User record should already exist from signup, just update if needed
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
              console.log('User record updated in database');
            }
          } catch (dbError) {
            console.error('Database error during user update:', dbError);
          }

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Check if we have URL hash with auth tokens but no session yet
          if (window.location.hash && window.location.hash.includes('access_token')) {
            console.log('URL contains auth tokens, waiting for session...');
            // Wait a bit for the session to be established
            setTimeout(async () => {
              const { data: retryData, error: retryError } = await supabase.auth.getSession();
              if (retryData.session?.user?.email_confirmed_at) {
                console.log('User verified after retry:', retryData.session.user.email);
                setStatus('success');
                setTimeout(() => navigate('/dashboard'), 2000);
              } else {
                setError('Email verification failed. The verification link may have expired or been used already.');
                setStatus('error');
              }
            }, 2000);
            return;
          }
          
          // Check if we have a token but it's not a signup token
          if (token && type !== 'signup') {
            setError(`Invalid verification type: ${type}. Please use the signup verification link.`);
            setStatus('error');
            return;
          }
          
          // Check if user exists but not verified
          if (data.session?.user && !data.session.user.email_confirmed_at) {
            setError('Email not yet verified. Please check your email and click the verification link.');
            setStatus('error');
          } else {
            setError('Email verification failed. Please check your email and click the verification link again, or try signing up again.');
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
