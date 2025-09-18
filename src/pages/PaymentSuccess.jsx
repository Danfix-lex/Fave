import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  AttachMoney,
  MusicNote,
  TrendingUp,
  ArrowForward,
  Home,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Get payment data from location state or URL params
    const state = location.state;
    const urlParams = new URLSearchParams(location.search);
    
    if (state?.paymentData) {
      setPaymentData(state.paymentData);
      setLoading(false);
    } else if (urlParams.get('reference')) {
      // Handle direct URL access with reference
      const reference = urlParams.get('reference');
      const songId = urlParams.get('song_id');
      const quantity = urlParams.get('quantity');
      const amount = urlParams.get('amount');
      const currency = urlParams.get('currency');
      
      setPaymentData({
        reference,
        songId,
        quantity: parseInt(quantity),
        amount: parseFloat(amount),
        currency,
        email: user?.email,
      });
      setLoading(false);
    } else {
      setError('No payment data found');
      setLoading(false);
    }
  }, [location, user]);

  const handleViewTokens = () => {
    navigate('/dashboard');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleBuyMore = () => {
    navigate('/upcoming');
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Alert severity="error" sx={{ textAlign: 'center' }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 4,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                }}
              >
                <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </motion.div>

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 2,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              Payment Successful!
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontWeight: 400,
              }}
            >
              Your tokens have been added to your account
            </Typography>

            <Chip
              icon={<AttachMoney />}
              label={`${paymentData?.quantity} Tokens Purchased`}
              sx={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'white',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 2,
                px: 3,
              }}
            />
          </Box>

          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              mb: 6,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  mb: 3,
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                Transaction Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <MusicNote sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Song
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {paymentData?.songTitle || 'Unknown Song'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AttachMoney sx={{ fontSize: 40, color: '#fbbf24', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Amount Paid
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#fbbf24', fontWeight: 700 }}>
                      {paymentData?.currency} {paymentData?.amount}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Tokens Received
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {paymentData?.quantity}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#a855f7', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      Transaction ID
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                      }}
                    >
                      {paymentData?.reference}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontWeight: 400,
              }}
            >
              What's next? Your tokens are now in your dashboard where you can track their performance and earnings.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={handleViewTokens}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                  },
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                View My Tokens
              </Button>

              <Button
                variant="outlined"
                size="large"
                endIcon={<MusicNote />}
                onClick={handleBuyMore}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Buy More Tokens
              </Button>

              <Button
                variant="text"
                size="large"
                startIcon={<Home />}
                onClick={handleGoHome}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                Go Home
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
