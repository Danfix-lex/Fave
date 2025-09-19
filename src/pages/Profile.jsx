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
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import { 
  Person, 
  Edit, 
  Save, 
  Cancel, 
  PhotoCamera, 
  Email, 
  Phone, 
  LocationOn, 
  Badge, 
  Security, 
  MusicNote, 
  Business, 
  Instagram, 
  Twitter, 
  YouTube,
  CloudUpload,
  CheckCircle,
  ErrorOutline,
  AccountBalance,
  Fingerprint,
  PhotoCamera as PhotoIcon,
} from '@mui/icons-material';

const Profile = () => {
  const { user, userProfile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [documentPreview, setDocumentPreview] = useState('');

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

  useEffect(() => {
    if (userProfile) {
      console.log('Profile component - userProfile updated:', userProfile);
      
      setFormData({
        full_name: userProfile.full_name || '',
        stage_name: userProfile.stage_name || '',
        id_number: userProfile.id_number || '',
        id_type: userProfile.id_type || '',
        profile_photo_url: userProfile.profile_photo_url || '',
        date_of_birth: userProfile.date_of_birth || '',
        nationality: userProfile.nationality || '',
        phone_number: userProfile.phone_number || '',
        bio: userProfile.bio || '',
        social_media: userProfile.social_media || {
          instagram: '',
          twitter: '',
          youtube: '',
          spotify: ''
        },
        address: userProfile.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postal_code: ''
        }
      });
    }
  }, [userProfile]);

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
      setSuccess('Profile photo updated successfully!');
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Photo upload error:', error);
      setError(`Failed to upload photo: ${error.message}`);
    }
  };

  const handleSave = async (section) => {
    setSubmitLoading(true);
    setError('');

    try {
      const updateData = {};
      
      if (section === 'personal') {
        updateData.full_name = formData.full_name.trim();
        updateData.date_of_birth = formData.date_of_birth;
        updateData.nationality = formData.nationality.trim();
        updateData.phone_number = formData.phone_number.trim();
      } else if (section === 'address') {
        updateData.address = {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          country: formData.address.country.trim(),
          postal_code: formData.address.postal_code.trim()
        };
      } else if (section === 'identity') {
        updateData.id_number = formData.id_number.trim();
        updateData.id_type = formData.id_type;
      } else if (section === 'profile') {
        updateData.profile_photo_url = formData.profile_photo_url;
      } else if (section === 'artist' && userProfile?.role === 'creator') {
        updateData.stage_name = formData.stage_name.trim();
        updateData.bio = formData.bio.trim();
        updateData.social_media = {
          instagram: formData.social_media.instagram.trim(),
          twitter: formData.social_media.twitter.trim(),
          youtube: formData.social_media.youtube.trim(),
          spotify: formData.social_media.spotify.trim()
        };
      }

      const result = await updateProfile(updateData);
      if (result.error) {
        setError(result.error.message);
      } else {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        setEditSection(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditSection(null);
    setError('');
    setSuccess('');
    // Reset form data to original values
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        stage_name: userProfile.stage_name || '',
        id_number: userProfile.id_number || '',
        id_type: userProfile.id_type || '',
        profile_photo_url: userProfile.profile_photo_url || '',
        date_of_birth: userProfile.date_of_birth || '',
        nationality: userProfile.nationality || '',
        phone_number: userProfile.phone_number || '',
        bio: userProfile.bio || '',
        social_media: userProfile.social_media || {
          instagram: '',
          twitter: '',
          youtube: '',
          spotify: ''
        },
        address: userProfile.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          postal_code: ''
        }
      });
    }
  };

  const renderPersonalInfo = () => (
    <Card elevation={8} sx={{ mb: 3, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Personal Information
          </Typography>
          <IconButton 
            onClick={() => { setEditMode(true); setEditSection('personal'); }}
            sx={{ color: 'white' }}
          >
            <Edit />
          </IconButton>
        </Box>

        {editMode && editSection === 'personal' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSave('personal')}
                  startIcon={submitLoading ? <CircularProgress size={20} /> : <Save />}
                  disabled={submitLoading}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Person color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Full Name</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.full_name || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Badge color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.date_of_birth || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Security color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Nationality</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.nationality || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Phone color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.phone_number || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderAddressInfo = () => (
    <Card elevation={8} sx={{ mb: 3, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Address Information
          </Typography>
          <IconButton 
            onClick={() => { setEditMode(true); setEditSection('address'); }}
            sx={{ color: 'white' }}
          >
            <Edit />
          </IconButton>
        </Box>

        {editMode && editSection === 'address' ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="primary" />
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
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSave('address')}
                  startIcon={submitLoading ? <CircularProgress size={20} /> : <Save />}
                  disabled={submitLoading}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <LocationOn color="primary" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">Address</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.address?.street || 'Not provided'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {userProfile?.address?.city && userProfile?.address?.state && 
                     `${userProfile.address.city}, ${userProfile.address.state}`}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {userProfile?.address?.country && userProfile?.address?.postal_code && 
                     `${userProfile.address.country} ${userProfile.address.postal_code}`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderIdentityInfo = () => (
    <Card elevation={8} sx={{ mb: 3, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Identity Verification
          </Typography>
          <IconButton 
            onClick={() => { setEditMode(true); setEditSection('identity'); }}
            sx={{ color: 'white' }}
          >
            <Edit />
          </IconButton>
        </Box>

        {editMode && editSection === 'identity' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>ID Type</InputLabel>
                <Select
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleChange}
                  label="ID Type"
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
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSave('identity')}
                  startIcon={submitLoading ? <CircularProgress size={20} /> : <Save />}
                  disabled={submitLoading}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Fingerprint color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">ID Type</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.id_type ? userProfile.id_type.replace('_', ' ').toUpperCase() : 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Badge color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">ID Number</Typography>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {userProfile?.id_number ? '••••••••' + userProfile.id_number.slice(-4) : 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  const renderProfilePhoto = () => (
    <Card elevation={8} sx={{ mb: 3, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Profile Photo
          </Typography>
          <IconButton 
            onClick={() => { setEditMode(true); setEditSection('profile'); }}
            sx={{ color: 'white' }}
          >
            <Edit />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Avatar
            src={userProfile?.profile_photo_url || photoPreview}
            sx={{ 
              width: 150, 
              height: 150, 
              mx: 'auto', 
              mb: 3,
              border: '3px solid #2196f3'
            }}
          />
          
          {editMode && editSection === 'profile' && (
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-photo-upload"
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="profile-photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{ mb: 2 }}
                >
                  Upload New Photo
                </Button>
              </label>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSave('profile')}
                  startIcon={submitLoading ? <CircularProgress size={20} /> : <Save />}
                  disabled={submitLoading}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderArtistProfile = () => {
    if (userProfile?.role !== 'creator') return null;

    return (
      <Card elevation={8} sx={{ mb: 3, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Artist Profile
            </Typography>
            <IconButton 
              onClick={() => { setEditMode(true); setEditSection('artist'); }}
              sx={{ color: 'white' }}
            >
              <Edit />
            </IconButton>
          </Box>

          {editMode && editSection === 'artist' ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stage Name"
                  name="stage_name"
                  value={formData.stage_name}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MusicNote color="primary" />
                      </InputAdornment>
                    ),
                  }}
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
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleSave('artist')}
                    startIcon={submitLoading ? <CircularProgress size={20} /> : <Save />}
                    disabled={submitLoading}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <MusicNote color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Stage Name</Typography>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {userProfile?.stage_name || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Person color="primary" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Bio</Typography>
                    <Typography variant="body1" sx={{ color: 'white' }}>
                      {userProfile?.bio || 'No bio provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Social Media</Typography>
                <Grid container spacing={2}>
                  {userProfile?.social_media?.instagram && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Instagram color="primary" />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          @{userProfile.social_media.instagram}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {userProfile?.social_media?.twitter && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Twitter color="primary" />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          @{userProfile.social_media.twitter}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {userProfile?.social_media?.youtube && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <YouTube color="primary" />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {userProfile.social_media.youtube}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {userProfile?.social_media?.spotify && (
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MusicNote color="primary" />
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {userProfile.social_media.spotify}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    );
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                My Profile
              </Typography>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 400,
                  mb: 3,
                }}
              >
                Manage your account information and preferences
              </Typography>
              
              {/* Profile Summary Card */}
              <Card
                elevation={12}
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  background: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={userProfile?.profile_photo_url}
                    sx={{ width: 80, height: 80, border: '3px solid #2196f3' }}
                  />
                  <Box sx={{ textAlign: 'left', flex: 1 }}>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      {userProfile?.full_name || 'User'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {userProfile?.email}
                    </Typography>
                    <Chip
                      label={userProfile?.role === 'creator' ? 'Artist' : 'Fan'}
                      color={userProfile?.role === 'creator' ? 'primary' : 'secondary'}
                      sx={{ mt: 1 }}
                    />
                    {userProfile?.stage_name && (
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 1 }}>
                        Stage Name: {userProfile.stage_name}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Card>
            </motion.div>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} icon={<ErrorOutline />}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircle />}>
              {success}
            </Alert>
          )}

          {/* Profile Sections */}
          <motion.div variants={cardVariants}>
            {renderPersonalInfo()}
            {renderAddressInfo()}
            {renderIdentityInfo()}
            {renderProfilePhoto()}
            {renderArtistProfile()}
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Profile;
