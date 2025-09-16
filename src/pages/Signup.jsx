import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ErrorOutline,
  PersonAdd,
  MusicNote,
  People,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const { signUp } = auth || {};
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Debug logging
  console.log('Auth context:', auth);
  console.log('signUp function:', signUp);
  console.log('typeof signUp:', typeof signUp);

  // Show error if signUp is not available
  if (!signUp || typeof signUp !== 'function') {
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
              <Typography variant="h4" sx={{ color: 'error.main', mb: 2 }}>
                ⚠️ Configuration Required
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                The signup function is not available. This is likely because Supabase is not properly configured.
              </Typography>
              <Box sx={{ 
                textAlign: 'left', 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                p: 2, 
                borderRadius: 1, 
                mb: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  To fix this, please:
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }} component="div">
                  1. Create a <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '2px' }}>.env</code> file in your project root
                  <br />
                  2. Add your Supabase credentials:
                  <br />
                  <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '2px' }}>VITE_SUPABASE_URL=your_supabase_project_url</code>
                  <br />
                  <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '2px' }}>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</code>
                  <br />
                  3. Restart your development server
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                  },
                }}
              >
                Refresh Page
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.role) {
      setError('Please select your role');
      setLoading(false);
      return;
    }

    try {
      // Check if signUp is a function
      if (typeof signUp !== 'function') {
        throw new Error('Signup function is not available. Please refresh the page and try again.');
      }

      // Add timeout to prevent hanging
      const signupPromise = signUp(formData.email, formData.password, formData.role);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signup timed out. Please try again.')), 30000)
      );

      const { data, error } = await Promise.race([signupPromise, timeoutPromise]);

      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Redirect to email verification page with user info
        navigate('/auth/verify-email', { 
          state: { 
            email: formData.email,
            role: formData.role,
            needsVerification: true 
          } 
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const roleOptions = [
    {
      value: 'creator',
      label: 'Creator',
      description: 'Musician, Author, Filmmaker',
      icon: MusicNote,
      color: 'primary',
    },
    {
      value: 'fan',
      label: 'Fan',
      description: 'Investor, Supporter',
      icon: People,
      color: 'secondary',
    },
  ];

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
              <Typography
                component={Link}
                to="/"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textDecoration: 'none',
                  display: 'block',
                  mb: 2,
                }}
              >
                Fave
              </Typography>
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
                Create Your Account
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                }}
              >
                Join the future of creative funding
              </Typography>
            </Box>

            {/* Form */}
            <motion.div variants={formVariants}>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                {error && (
                  <Alert
                    severity="error"
                    icon={<ErrorOutline />}
                    sx={{ mb: 3, borderRadius: 2 }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Role Selection */}
                <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                    I am a...
                  </FormLabel>
                  <RadioGroup
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
                  >
                    {roleOptions.map((option) => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ flex: 1 }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: formData.role === option.value ? 2 : 1,
                            borderColor: formData.role === option.value 
                              ? `${option.color}.main` 
                              : 'divider',
                            backgroundColor: formData.role === option.value 
                              ? `${option.color}.50` 
                              : 'background.paper',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              borderColor: `${option.color}.main`,
                              backgroundColor: `${option.color}.50`,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <FormControlLabel
                              value={option.value}
                              control={<Radio />}
                              label={
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      mb: 1,
                                    }}
                                  >
                                    <option.icon
                                      sx={{
                                        fontSize: 32,
                                        color: `${option.color}.main`,
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      color: 'text.primary',
                                      mb: 0.5,
                                    }}
                                  >
                                    {option.label}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    {option.description}
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                margin: 0,
                                width: '100%',
                                '& .MuiFormControlLabel-label': {
                                  width: '100%',
                                },
                              }}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                  sx={{
                    py: 1.5,
                    mb: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                {loading && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      This may take a few moments. Please don't close this page.
                    </Typography>
                  </Box>
                )}

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Already have an account?{' '}
                    <Typography
                      component={Link}
                      to="/login"
                      variant="body2"
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
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Signup;
