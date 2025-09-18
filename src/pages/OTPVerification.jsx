import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
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
  Security,
  CheckCircle,
  Refresh,
  ArrowForward,
  Timer,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no state, redirect to signup
      navigate('/signup');
      return;
    }

    // Start countdown for resend button
    setCountdown(60);
  }, [navigate, location.state]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Verify the OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) throw error;

      if (data.user) {
        
        // Create user record in database
        try {
          const { error: dbError } = await supabase
            .from('users')
            .upsert([{
              id: data.user.id,
              email: data.user.email,
              role: location.state?.role || 'fan',
              is_kyc_complete: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }], {
              onConflict: 'id'
            });

          if (dbError) {
            // Don't fail the flow for database errors
          } else {
          }
        } catch (dbError) {
        }

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
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
      setCountdown(60); // Reset countdown
    } catch (error) {
      setError(error.message);
    } finally {
      setIsResending(false);
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
                <Security sx={{ fontSize: 40, color: 'white' }} />
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
                We've sent a 6-digit code to
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
                    Enter Verification Code:
                  </Typography>
                  <TextField
                    fullWidth
                    value={otp}
                    onChange={handleOTPChange}
                    placeholder="000000"
                    inputProps={{
                      maxLength: 6,
                      style: {
                        textAlign: 'center',
                        fontSize: '2rem',
                        letterSpacing: '0.5rem',
                        fontWeight: 'bold',
                        color: 'white',
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
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
                    }}
                  />
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
                New verification code sent! Please check your email.
              </Alert>
            )}

            {/* Action Buttons */}
            <motion.div variants={cardVariants}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isVerifying || otp.length !== 6}
                  startIcon={isVerifying ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                  onClick={handleVerifyOTP}
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
                  {isVerifying ? 'Verifying...' : 'Verify Code'}
                </Button>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Didn't receive the code?
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  disabled={isResending || countdown > 0}
                  startIcon={isResending ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                  onClick={handleResendOTP}
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
                      : 'Resend Code'
                  }
                </Button>
              </Box>
            </motion.div>

            {/* Security Notice */}
            <motion.div variants={cardVariants}>
              <Alert 
                severity="info" 
                icon={<Timer />} 
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
                  The verification code will expire in 10 minutes. If you don't receive the code, 
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

export default OTPVerification;
