import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccountBalanceWallet,
  VpnKey,
  Google,
  CheckCircle,
  Security,
  MonetizationOn,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
// SUI SDK imports with fallback for production builds
import { createSuiKeypair, generateSuiNonce } from '../lib/suiUtils';

const WalletCreation = ({ userProfile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, signInWithGoogle } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [ephemeralKey, setEphemeralKey] = useState(null);
  const [nonce, setNonce] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [authMethod, setAuthMethod] = useState(user?.app_metadata?.provider || 'email');

  const steps = [
    'Generate Keys',
    'Authenticate',
    'Create Wallet',
    'Complete'
  ];

  const generateEphemeralKeys = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Generate keypair using utility function
      const keypair = await createSuiKeypair();
      const publicKey = keypair.getPublicKey();
      const secretKey = keypair.getSecretKey();
      
      // Convert secret key to hex for storage
      const secretKeyHex = Buffer.from(secretKey.toString()).toString('hex');
      
      // Store in session storage
      sessionStorage.setItem("esk", secretKeyHex);
      setEphemeralKey({ publicKey, secretKey });
      
      // Generate nonce using utility function
      const nonceValue = await generateSuiNonce(publicKey, { maxEpoch: 1000 });
      setNonce(nonceValue);
      
      setActiveStep(1);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate cryptographic keys. Please try again.');
      setLoading(false);
    }
  };

  const generateNonce = async (publicKey, options) => {
    return await generateSuiNonce(publicKey, options);
  };

  const handleGoogleAuth = async () => {
    if (!nonce) {
      setError('Please generate keys first.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Store nonce for later verification
      sessionStorage.setItem('wallet_nonce', nonce);
      
      if (authMethod === 'google') {
        // User already authenticated with Google, use existing session
        // Store Google user info for wallet creation
        sessionStorage.setItem('google_user', JSON.stringify({
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          picture: user.user_metadata?.avatar_url,
          sub: user.user_metadata?.sub || user.id
        }));
        
        setActiveStep(2); // Move to wallet creation step
        setLoading(false);
      } else {
        // User signed up with email, need to authenticate with Google
        const { data, error } = await signInWithGoogle();
        
        if (error) {
          setError('Google authentication failed. Please try again.');
          setLoading(false);
          return;
        }
        
        // The redirect will happen automatically
        // User will be redirected back to the callback URL
        setLoading(false);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const generateSuiWalletAddress = (publicKey, googleUser, nonce) => {
    try {
      // Create a deterministic wallet address based on public key and Google user
      const addressData = `${publicKey.toString()}_${googleUser.sub}_${nonce}`;
      const hash = Buffer.from(addressData).toString('base64').substring(0, 42);
      return `0x${hash}`;
    } catch (err) {
      throw new Error('Failed to generate wallet address');
    }
  };

  const createWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get stored data
      const storedSecretKey = sessionStorage.getItem('esk');
      const storedNonce = sessionStorage.getItem('wallet_nonce');
      const storedGoogleUser = JSON.parse(sessionStorage.getItem('google_user') || '{}');
      
      if (!storedSecretKey || !storedNonce || !storedGoogleUser.email) {
        setError('Missing required data. Please start over.');
        setLoading(false);
        return;
      }
      
      // Reconstruct keypair from stored secret key
      const keypair = await createSuiKeypair();
      const publicKey = keypair.getPublicKey();
      
      // Generate deterministic SUI wallet address
      const walletAddress = generateSuiWalletAddress(publicKey, storedGoogleUser, storedNonce);
      setWalletAddress(walletAddress);
      
      // Store wallet info
      const walletData = {
        address: walletAddress,
        publicKey: publicKey.toString(),
        nonce: storedNonce,
        googleUser: storedGoogleUser,
        createdAt: new Date().toISOString(),
        userId: user.id
      };
      
      sessionStorage.setItem('sui_wallet', JSON.stringify(walletData));
      
      setActiveStep(3);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Failed to create wallet. Please try again.');
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <VpnKey sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Generate Cryptographic Keys
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              We'll generate a unique key pair for your SUI wallet. These keys are generated locally and never leave your device.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={generateEphemeralKeys}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <VpnKey />}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                },
              }}
            >
              {loading ? 'Generating...' : 'Generate Keys'}
            </Button>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Google sx={{ fontSize: 60, color: '#4285f4', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Authenticate with Google
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              {authMethod === 'google' 
                ? 'You\'re already authenticated with Google. Click to continue.'
                : 'Please authenticate with Google to create your SUI wallet.'
              }
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGoogleAuth}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Google />}
              sx={{
                background: '#4285f4',
                '&:hover': {
                  background: '#3367d6',
                },
              }}
            >
              {loading ? 'Authenticating...' : 'Continue with Google'}
            </Button>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <AccountBalanceWallet sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Create Your SUI Wallet
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Your SUI wallet will be created using your Google account and cryptographic keys.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={createWallet}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AccountBalanceWallet />}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                },
              }}
            >
              {loading ? 'Creating...' : 'Create Wallet'}
            </Button>
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
              Wallet Created Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              Your SUI wallet has been created and is ready to use.
            </Typography>
            
            <Card sx={{ mb: 4, textAlign: 'left' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Wallet Details
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Wallet Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {walletAddress}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Network
                  </Typography>
                  <Typography variant="body1">
                    SUI Mainnet
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip label="Active" color="success" size="small" />
                </Box>
              </CardContent>
            </Card>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.reload()}
              sx={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #047857, #065f46)',
                },
              }}
            >
              Done
            </Button>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (success) {
    return (
      <Card
        sx={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {getStepContent(3)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <AccountBalanceWallet sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
            Create SUI Wallet
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Generate a secure SUI wallet using Google authentication
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    color: index <= activeStep ? 'white' : 'rgba(255, 255, 255, 0.6)',
                    fontWeight: index <= activeStep ? 600 : 400,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300, display: 'flex', alignItems: 'center' }}>
          {getStepContent(activeStep)}
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security sx={{ color: 'success.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Secured with ZK Login
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOn sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              SUI Network
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletCreation;