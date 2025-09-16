import React, { useState, useEffect } from 'react';
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
  Alert 
} from '@mui/material';
import { 
  MusicNote, 
  Person, 
  CameraAlt, 
  UploadFile, 
  CheckCircle, 
  ErrorOutline, 
  Security 
} from '@mui/icons-material';

const KYC = () => {
  const { user, userProfile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (userProfile?.is_kyc_complete) {
      navigate('/dashboard');
      return;
    }

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

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (error) throw error;

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

    if (!formData.full_name.trim()) {
      setError('Full name is required');
      setSubmitLoading(false);
      return;
    }

    if (!formData.id_number.trim()) {
      setError('ID number is required');
      setSubmitLoading(false);
      return;
    }

    if (userProfile?.role === 'creator' && !formData.distributor_id) {
      setError('Please select your distributor');
      setSubmitLoading(false);
      return;
    }

    const profileData = {
      full_name: formData.full_name.trim(),
      id_number: formData.id_number.trim(),
      profile_photo_url: formData.profile_photo_url || null,
    };

    if (userProfile?.role === 'creator') {
      profileData.stage_name = formData.stage_name.trim() || null;
      profileData.distributor_id = formData.distributor_id;
    }

    const { error } = await updateProfile(profileData);

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }

    setSubmitLoading(false);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={12} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Avatar sx={{ mx: 'auto', width: 64, height: 64, bgcolor: 'primary.light' }}>
            {userProfile.role === 'creator' ? (
              <MusicNote sx={{ fontSize: 40, color: 'primary.main' }} />
            ) : (
              <Person sx={{ fontSize: 40, color: 'primary.main' }} />
            )}
          </Avatar>
          <Typography variant="h4" component="h1" sx={{ mt: 3, fontWeight: 700 }}>
            Complete Your Profile
          </Typography>
          <Typography variant="h6" sx={{ mt: 1.5, color: 'text.secondary', fontWeight: 400 }}>
            Verify your identity to secure your account as a{' '}
            <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {userProfile.role}
            </Typography>.
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Stepper activeStep={1} alternativeLabel>
            <Step>
              <StepLabel>Account Created</StepLabel>
            </Step>
            <Step>
              <StepLabel>Profile Setup</StepLabel>
            </Step>
            <Step>
              <StepLabel>Ready to Use</StepLabel>
            </Step>
          </Stepper>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {error && (
            <Alert severity="error" icon={<ErrorOutline />} sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 4 }}>
            <Avatar
              src={photoPreview || formData.profile_photo_url}
              sx={{ width: 96, height: 96, bgcolor: 'grey.200' }}
            >
              <CameraAlt sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFile />}
              >
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  hidden
                />
              </Button>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                PNG, JPG up to 5MB
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            required
            margin="normal"
            id="full_name"
            name="full_name"
            label="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full legal name"
          />

          {userProfile.role === 'creator' && (
            <TextField
              fullWidth
              margin="normal"
              id="stage_name"
              name="stage_name"
              label="Stage/Artist Name"
              value={formData.stage_name}
              onChange={handleChange}
              placeholder="Your professional/stage name"
              helperText="The name you perform or publish under (optional)"
            />
          )}

          {userProfile.role === 'creator' && (
            <FormControl fullWidth required margin="normal">
              <InputLabel id="distributor-label">Music Distributor</InputLabel>
              <Select
                labelId="distributor-label"
                id="distributor_id"
                name="distributor_id"
                value={formData.distributor_id}
                onChange={handleChange}
                label="Music Distributor"
              >
                <MenuItem value="">
                  <em>Select your distributor</em>
                </MenuItem>
                {distributors.map((distributor) => (
                  <MenuItem key={distributor.id} value={distributor.id}>
                    {distributor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <TextField
            fullWidth
            required
            margin="normal"
            id="id_number"
            name="id_number"
            label="Government ID Number"
            value={formData.id_number}
            onChange={handleChange}
            placeholder="National ID, passport, or driver's license number"
            helperText="Required for identity verification and compliance"
          />

          <TextField
            fullWidth
            disabled
            margin="normal"
            label="Email Address"
            defaultValue={user.email}
          />

          <TextField
            fullWidth
            disabled
            margin="normal"
            label="Account Type"
            defaultValue={userProfile.role}
            sx={{ textTransform: 'capitalize' }}
          />

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitLoading}
              startIcon={submitLoading ? <CircularProgress size={20} /> : <CheckCircle />}
            >
              {submitLoading ? 'Setting Up Profile...' : 'Complete Profile Setup'}
            </Button>
          </Box>
        </Box>

        <Alert severity="info" icon={<Security />} sx={{ mt: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Your Information is Secure</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            All personal information is encrypted and stored securely. We use this data solely for identity verification and regulatory compliance.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default KYC;