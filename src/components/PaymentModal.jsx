import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AttachMoney,
  Security,
  CheckCircle,
  Close,
} from '@mui/icons-material';
import { usePaystackPayment } from 'react-paystack';
import { motion } from 'framer-motion';

const PaymentModal = ({ 
  open, 
  onClose, 
  song, 
  tokenPrice, 
  currency, 
  onPaymentSuccess,
  user 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate total amount
  const totalAmount = (tokenPrice * quantity * 100).toFixed(0); // Convert to kobo/pesewas
  const displayAmount = (tokenPrice * quantity).toFixed(2);

  // Paystack configuration
  const config = {
    reference: `FAVE_${Date.now()}_${song?.id}`,
    email: email,
    amount: parseInt(totalAmount),
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_fa623a1322f923ff6188b679d1963721c2d50783',
    currency: currency === 'NGN' ? 'NGN' : 'USD',
    metadata: {
      song_id: song?.id,
      song_title: song?.title,
      artist_name: song?.artist_name,
      token_quantity: quantity,
      token_price: tokenPrice,
      user_id: user?.id,
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference) => {
    setLoading(true);
    try {
      // Call the success callback with payment details
      await onPaymentSuccess({
        reference,
        songId: song?.id,
        quantity,
        amount: displayAmount,
        currency,
        email,
      });
      
      // Close modal after successful payment
      onClose();
    } catch (error) {
      setError('Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const onClosePayment = () => {
    setError('');
    onClose();
  };

  const handlePayment = () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (quantity < 1) {
      setError('Please enter a valid quantity');
      return;
    }

    setError('');
    initializePayment(onSuccess, onClosePayment);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  return (
    <Dialog
      open={open}
      onClose={onClosePayment}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: isMobile ? 0 : 3,
        }
      }}
    >
      <DialogTitle sx={{ 
        color: 'white', 
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <AttachMoney sx={{ mr: 1, color: '#fbbf24' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Purchase Tokens
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Secure payment powered by Paystack
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, background: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.3)' }}>
            {error}
          </Alert>
        )}

        {/* Song Details */}
        <Card sx={{ 
          mb: 3, 
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 600 }}>
              {song?.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
              by {song?.artist_name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Token Price:
              </Typography>
              <Typography variant="h6" sx={{ color: '#fbbf24', fontWeight: 600 }}>
                {currency} {tokenPrice?.toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#3b82f6',
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: 1000 }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#3b82f6',
                  },
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Payment Summary */}
        <Box sx={{ 
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 2,
          p: 3,
          mb: 3
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Payment Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {quantity} token{quantity > 1 ? 's' : ''} × {currency} {tokenPrice?.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {currency} {displayAmount}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Total Amount:
            </Typography>
            <Typography variant="h5" sx={{ color: '#fbbf24', fontWeight: 700 }}>
              {currency} {displayAmount}
            </Typography>
          </Box>
        </Box>

        {/* Security Notice */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 2
        }}>
          <Security sx={{ color: '#10b981', mr: 1 }} />
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Your payment is secured by Paystack. We never store your card details.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          onClick={onClosePayment}
          variant="outlined"
          startIcon={<Close />}
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
          disabled={loading || !email || quantity < 1}
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
          {loading ? 'Processing...' : `Pay ${currency} ${displayAmount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
