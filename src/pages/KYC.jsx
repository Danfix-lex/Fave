import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Avatar, 
  Alert,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { 
  MusicNote, 
  Person, 
  CameraAlt, 
  UploadFile, 
  CheckCircle, 
  ErrorOutline, 
  Security,
  Business,
  Badge,
  PhotoCamera,
  ArrowForward,
  ArrowBack,
  Verified,
  AccountBalance,
  Fingerprint,
  CloudUpload,
} from '@mui/icons-material';

const KYC = () => {
  const { user, userProfile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    full_name: '',
    stage_name: '',
    distributor_id: '',
    id_number: '',
    profile_photo_url: ''
  });
  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
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
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // KYC Steps configuration - role specific
  const getStepsForRole = (role) => {
    const baseSteps = [
      {
        title: 'Personal Information',
        description: 'Tell us about yourself',
        icon: Person,
        fields: ['full_name']
      },
      {
        title: 'Identity Verification',
        description: 'Verify your identity',
        icon: Fingerprint,
        fields: ['id_number']
      },
      {
        title: 'Profile Photo',
        description: 'Upload your profile picture',
        icon: PhotoCamera,
        fields: ['profile_photo_url']
      }
    ];

    if (role === 'creator') {
      baseSteps.splice(1, 0, {
        title: 'Artist Profile',
        description: 'Set up your artist identity',
        icon: MusicNote,
        fields: ['stage_name']
      });
      baseSteps.push({
        title: 'Distribution Partner',
        description: 'Select your distribution partner',
        icon: Business,
        fields: ['distributor_id']
      });
    }

    return baseSteps;
  };

  const steps = getStepsForRole(userProfile?.role);

  useEffect(() => {
    // Redirect to dashboard if KYC is already complete
    if (userProfile?.is_kyc_complete) {
      console.log('KYC already complete, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }

    // Only fetch distributors for creators
    if (userProfile?.role === 'creator') {
      fetchDistributors();
    }
  }, [userProfile, navigate]);

  const fetchDistributors = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setDistributors(data || []);
    } catch (error) {
      console.error('Error fetching distributors:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      const { supabase } = await import('../lib/supabase');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setFormData({
        ...formData,
        profile_photo_url: urlData.publicUrl
      });
      setPhotoPreview(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      const profileData = {
        full_name: formData.full_name.trim(),
        id_number: formData.id_number.trim(),
        profile_photo_url: formData.profile_photo_url || null,
      };

      if (userProfile?.role === 'creator') {
        profileData.stage_name = formData.stage_name.trim() || null;
        profileData.distributor_id = formData.distributor_id;
      }

      const result = await updateProfile(profileData);
      if (result.error) {
        setError(result.error.message);
      } else {
        console.log('KYC completed successfully, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const isStepValid = (stepIndex) => {
    const step = steps[stepIndex];
    return step.fields.every(field => {
      // Skip distributor validation for non-creators
      if (field === 'distributor_id' && userProfile?.role !== 'creator') return true;
      // Skip stage_name validation for non-creators
      if (field === 'stage_name' && userProfile?.role !== 'creator') return true;
      return formData[field] && formData[field].trim() !== '';
    });
  };

  const renderStepContent = (stepIndex) => {
    const step = steps[stepIndex];
    const stepTitle = step.title.toLowerCase();
    
    if (stepTitle.includes('personal information')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
          </Grid>
        </Grid>
      );
    }

    if (stepTitle.includes('artist profile')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Stage Name"
              name="stage_name"
              value={formData.stage_name}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MusicNote color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Your artist name or stage name"
            />
          </Grid>
        </Grid>
      );
    }

    if (stepTitle.includes('identity verification')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Government ID Number"
              name="id_number"
              value={formData.id_number}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Enter your passport, driver's license, or national ID number"
            />
          </Grid>
        </Grid>
      );
    }

    if (stepTitle.includes('profile photo')) {
      return (
        <Box textAlign="center">
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            type="file"
            onChange={handlePhotoUpload}
          />
          <label htmlFor="photo-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
              size="large"
              sx={{ mb: 3 }}
            >
              Upload Profile Photo
            </Button>
          </label>
          {photoPreview && (
            <Box mt={2}>
              <Avatar
                src={photoPreview}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Photo uploaded successfully
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Upload a clear photo of yourself. This will be your profile picture.
          </Typography>
        </Box>
      );
    }

    if (stepTitle.includes('distribution partner')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Distribution Partner</InputLabel>
              <Select
                name="distributor_id"
                value={formData.distributor_id}
                onChange={handleChange}
                label="Distribution Partner"
                startAdornment={
                  <InputAdornment position="start">
                    <Business color="primary" />
                  </InputAdornment>
                }
              >
                {distributors.map((distributor) => (
                  <MenuItem key={distributor.id} value={distributor.id}>
                    {distributor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!userProfile) {
    return null;
  }

  // Show loading while redirecting if KYC is complete
  if (userProfile?.is_kyc_complete) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ 
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Redirecting to dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                Complete Your KYC
              </Typography>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                {userProfile?.role === 'creator' 
                  ? 'Verify your identity and set up your artist profile' 
                  : 'Verify your identity to unlock all features'
                }
              </Typography>
              
              {/* Progress Indicator */}
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((step, index) => (
                    <Step key={step.title}>
                      <StepLabel
                        StepIconComponent={({ active, completed }) => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: completed 
                                ? '#4caf50' 
                                : active 
                                  ? '#2196f3' 
                                  : 'rgba(255, 255, 255, 0.3)',
                              color: 'white',
                            }}
                          >
                            {completed ? <CheckCircle /> : React.createElement(step.icon)}
                          </Box>
                        )}
                      >
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {step.title}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </motion.div>
          </Box>

          {/* Main Content */}
          <motion.div variants={cardVariants}>
            <Card
              elevation={24}
              sx={{
                borderRadius: 4,
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                {/* Current Step Header */}
                <Box textAlign="center" mb={4}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
                    }}
                  >
                    {React.createElement(steps[activeStep].icon, { sx: { fontSize: 40 } })}
                  </Avatar>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, color: 'white' }}>
                    {steps[activeStep].title}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                    {steps[activeStep].description}
                  </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ mb: 4, borderRadius: 2 }}
                    icon={<ErrorOutline />}
                  >
                    {error}
                  </Alert>
                )}

                {/* Step Content */}
                <Box component="form" onSubmit={handleSubmit}>
                  {renderStepContent(activeStep)}

                  {/* Navigation Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      startIcon={<ArrowBack />}
                      sx={{ minWidth: 120 }}
                    >
                      Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={submitLoading || !isStepValid(activeStep)}
                        startIcon={submitLoading ? <CircularProgress size={20} /> : <Verified />}
                        sx={{
                          minWidth: 160,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #4caf50, #45a049)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #45a049, #3d8b40)',
                          },
                        }}
                      >
                        {submitLoading ? 'Completing...' : 'Complete KYC'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        disabled={!isStepValid(activeStep)}
                        endIcon={<ArrowForward />}
                        sx={{
                          minWidth: 120,
                          py: 1.5,
                          background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #1976d2, #1565c0)',
                          },
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default KYC;