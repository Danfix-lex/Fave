import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  MusicNote,
  Upload,
  Send,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MUSIC_GENRES } from '../lib/constants';

const SongSubmission = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    coverImageUrl: '',
    audioFileUrl: '',
    proposedReleaseDate: '',
    proposedPricePerToken: '',
    proposedTotalTokens: 1000,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const genres = MUSIC_GENRES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (file, type) => {
    try {
      setUploadProgress(0);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${type}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('song-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('song-files')
        .getPublicUrl(filePath);
      
      setUploadProgress(100);
      return publicUrl;
    } catch (err) {
      throw err;
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const url = await handleFileUpload(file, 'covers');
      setFormData(prev => ({ ...prev, coverImageUrl: url }));
    } catch (err) {
      setError('Failed to upload cover image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const url = await handleFileUpload(file, 'audio');
      setFormData(prev => ({ ...prev, audioFileUrl: url }));
    } catch (err) {
      setError('Failed to upload audio file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validation
      if (!formData.title || !formData.genre || !formData.description) {
        throw new Error('Please fill in all required fields');
      }

      if (!formData.coverImageUrl || !formData.audioFileUrl) {
        throw new Error('Please upload both cover image and audio file');
      }

      if (!formData.proposedReleaseDate) {
        throw new Error('Please select a proposed release date');
      }

      if (!formData.proposedPricePerToken || parseFloat(formData.proposedPricePerToken) <= 0) {
        throw new Error('Please enter a valid price per token');
      }

      // Submit to database
      const { data, error } = await supabase
        .from('song_submissions')
        .insert([{
          artist_id: user.id,
          title: formData.title,
          genre: formData.genre,
          description: formData.description,
          cover_image_url: formData.coverImageUrl,
          audio_file_url: formData.audioFileUrl,
          proposed_release_date: formData.proposedReleaseDate,
          proposed_price_per_token_usd: parseFloat(formData.proposedPricePerToken),
          proposed_total_tokens: parseInt(formData.proposedTotalTokens),
        }]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        title: '',
        genre: '',
        description: '',
        coverImageUrl: '',
        audioFileUrl: '',
        proposedReleaseDate: '',
        proposedPricePerToken: '',
        proposedTotalTokens: 1000,
      });
    } catch (err) {
      setError(err.message || 'Failed to submit song. Please try again.');
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

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
          <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Song Submitted Successfully!
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 4 }}>
            Your song has been submitted for admin review. You'll be notified once it's approved.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setSuccess(false)}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              },
            }}
          >
            Submit Another Song
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
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
              <MusicNote sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                Submit Your Song
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Create and submit your song for tokenization
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Song Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Song Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
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
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Genre */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Genre</InputLabel>
                    <Select
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Release Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Proposed Release Date"
                    name="proposedReleaseDate"
                    type="date"
                    value={formData.proposedReleaseDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
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
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Song Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
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
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Cover Image Upload */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Cover Image
                    </Typography>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="cover-image-upload"
                      type="file"
                      onChange={handleCoverImageUpload}
                    />
                    <label htmlFor="cover-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Upload />}
                        fullWidth
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          },
                        }}
                      >
                        Upload Cover
                      </Button>
                    </label>
                    {formData.coverImageUrl && (
                      <Chip
                        label="Cover uploaded"
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Grid>

                {/* Audio File Upload */}
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Audio File
                    </Typography>
                    <input
                      accept="audio/*"
                      style={{ display: 'none' }}
                      id="audio-file-upload"
                      type="file"
                      onChange={handleAudioUpload}
                    />
                    <label htmlFor="audio-file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Upload />}
                        fullWidth
                        sx={{
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          },
                        }}
                      >
                        Upload Audio
                      </Button>
                    </label>
                    {formData.audioFileUrl && (
                      <Chip
                        label="Audio uploaded"
                        color="success"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Grid>

                {/* Price per Token */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price per Token (USD)"
                    name="proposedPricePerToken"
                    type="number"
                    value={formData.proposedPricePerToken}
                    onChange={handleChange}
                    inputProps={{ min: 0.01, step: 0.01 }}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
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
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Total Tokens */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Total Tokens"
                    name="proposedTotalTokens"
                    type="number"
                    value={formData.proposedTotalTokens}
                    onChange={handleChange}
                    inputProps={{ min: 100, max: 10000 }}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
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
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Upload Progress */}
                {loading && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                        Uploading files...
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{ borderRadius: 1 }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                      },
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit for Review'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default SongSubmission;
