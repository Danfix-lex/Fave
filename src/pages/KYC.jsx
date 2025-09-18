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
    id_type: '',
    id_document_url: '',
    profile_photo_url: '',
    bio: '',
    social_media: {
      instagram: '',
      twitter: '',
      youtube: '',
      spotify: ''
    },
    date_of_birth: '',
    nationality: '',
    phone_number: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    }
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
        fields: ['full_name', 'date_of_birth', 'nationality', 'phone_number']
      },
      {
        title: 'Address Information',
        description: 'Your contact address',
        icon: AccountBalance,
        fields: ['address.street', 'address.city', 'address.state', 'address.country', 'address.postal_code']
      },
      {
        title: 'Identity Verification',
        description: 'Verify your identity with documents',
        icon: Fingerprint,
        fields: ['id_type', 'id_number', 'id_document_url']
      },
      {
        title: 'Profile Photo',
        description: 'Upload your profile picture',
        icon: PhotoCamera,
        fields: ['profile_photo_url']
      }
    ];

    if (role === 'creator') {
      baseSteps.splice(2, 0, {
        title: 'Artist Profile',
        description: 'Set up your artist identity',
        icon: MusicNote,
        fields: ['stage_name', 'bio', 'social_media.instagram', 'social_media.twitter', 'social_media.youtube', 'social_media.spotify']
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
      // Handle error silently
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      const fileName = `profile-${user.id}-${Date.now()}.${fileExt}`;
      
      // Try to upload directly - if bucket doesn't exist, it will be created automatically
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('already exists')) {
          setError('File with this name already exists. Please try again.');
        } else if (uploadError.message.includes('not found')) {
          setError('Storage bucket not found. Please contact support.');
        } else {
          setError(`Upload failed: ${uploadError.message}`);
        }
        return;
      }

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        profile_photo_url: urlData.publicUrl
      }));
      setPhotoPreview(URL.createObjectURL(file));
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Photo upload error:', error);
      setError(`Failed to upload photo: ${error.message}`);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
      setError('Please select a valid image or PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Document size must be less than 10MB');
      return;
    }

    try {
      const { supabase } = await import('../lib/supabase');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `id-document-${user.id}-${Date.now()}.${fileExt}`;
      
      // Try to upload directly - if bucket doesn't exist, it will be created automatically
      
      const { error: uploadError } = await supabase.storage
        .from('identity-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        if (uploadError.message.includes('already exists')) {
          setError('File with this name already exists. Please try again.');
        } else if (uploadError.message.includes('not found')) {
          setError('Storage bucket not found. Please contact support.');
        } else {
          setError(`Upload failed: ${uploadError.message}`);
        }
        return;
      }

      const { data: urlData } = supabase.storage
        .from('identity-documents')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        id_document_url: urlData.publicUrl
      }));
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Document upload error:', error);
      setError(`Failed to upload document: ${error.message}`);
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
        id_type: formData.id_type,
        id_document_url: formData.id_document_url || null,
        profile_photo_url: formData.profile_photo_url || null,
        date_of_birth: formData.date_of_birth,
        nationality: formData.nationality.trim(),
        phone_number: formData.phone_number.trim(),
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          country: formData.address.country.trim(),
          postal_code: formData.address.postal_code.trim()
        }
      };

      if (userProfile?.role === 'creator') {
        profileData.stage_name = formData.stage_name.trim() || null;
        profileData.distributor_id = formData.distributor_id;
        profileData.bio = formData.bio.trim() || null;
        profileData.social_media = {
          instagram: formData.social_media.instagram.trim() || null,
          twitter: formData.social_media.twitter.trim() || null,
          youtube: formData.social_media.youtube.trim() || null,
          spotify: formData.social_media.spotify.trim() || null
        };
      }

      const result = await updateProfile(profileData);
      if (result.error) {
        setError(result.error.message);
      } else {
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
      
      // Handle nested field validation
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const value = formData[parent]?.[child];
        return value && value.toString().trim() !== '';
      }
      
      return formData[field] && formData[field].toString().trim() !== '';
    });
  };

  const renderStepContent = (stepIndex) => {
    const step = steps[stepIndex];
    const stepTitle = step.title.toLowerCase();
    
    if (stepTitle.includes('personal information')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
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
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
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
            />
          </Grid>
        </Grid>
      );
    }

    if (stepTitle.includes('address information')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountBalance color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="State/Province"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Postal Code"
              name="address.postal_code"
              value={formData.address.postal_code}
              onChange={handleChange}
              required
              variant="outlined"
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              helperText="Tell us about yourself as an artist"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Instagram Handle"
              name="social_media.instagram"
              value={formData.social_media.instagram}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>@</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Twitter Handle"
              name="social_media.twitter"
              value={formData.social_media.twitter}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>@</Typography>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="YouTube Channel"
              name="social_media.youtube"
              value={formData.social_media.youtube}
              onChange={handleChange}
              variant="outlined"
              helperText="Your YouTube channel URL or handle"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Spotify Profile"
              name="social_media.spotify"
              value={formData.social_media.spotify}
              onChange={handleChange}
              variant="outlined"
              helperText="Your Spotify artist profile URL"
            />
          </Grid>
        </Grid>
      );
    }

    if (stepTitle.includes('identity verification')) {
      return (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>ID Type</InputLabel>
              <Select
                name="id_type"
                value={formData.id_type}
                onChange={handleChange}
                label="ID Type"
                required
              >
                <MenuItem value="passport">Passport</MenuItem>
                <MenuItem value="drivers_license">Driver's License</MenuItem>
                <MenuItem value="national_id">National ID</MenuItem>
                <MenuItem value="voters_card">Voter's Card</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="ID Number"
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
              helperText="Enter your ID number exactly as it appears"
            />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <input
                accept="image/*,application/pdf"
                style={{ display: 'none' }}
                id="document-upload"
                type="file"
                onChange={handleDocumentUpload}
              />
              <label htmlFor="document-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  size="large"
                  sx={{ mb: 2 }}
                >
                  Upload ID Document
                </Button>
              </label>
              {formData.id_document_url && (
                <Box mt={2}>
                  <Chip
                    label="Document uploaded successfully"
                    color="success"
                    icon={<CheckCircle />}
                    sx={{ mb: 1 }}
                  />
                </Box>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Upload a clear photo or scan of your ID document. Accepted formats: JPG, PNG, PDF (Max 10MB)
              </Typography>
            </Box>
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
                sx={{ width: 150, height: 150, mx: 'auto', mb: 2, border: '3px solid #2196f3' }}
              />
              <Chip
                label="Photo uploaded successfully"
                color="success"
                icon={<CheckCircle />}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
            Upload a clear, professional photo of yourself. This will be your profile picture and should be:
            <br />• High quality and well-lit
            <br />• Your face clearly visible
            <br />• Professional or casual (no inappropriate content)
            <br />• JPG, PNG format (Max 5MB)
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