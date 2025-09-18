import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AdminPanelSettings,
  MusicNote,
  CheckCircle,
  Cancel,
  Edit,
  MoreVert,
  PlayArrow,
  Pause,
  Visibility,
  Send,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [action, setAction] = useState('');
  const [playingAudio, setPlayingAudio] = useState(null);
  const [adminRole, setAdminRole] = useState('admin');
  const [adminPermissions, setAdminPermissions] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin user info
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (adminData) {
        setAdminRole(adminData.role);
        setAdminPermissions(adminData.permissions || {});
      }
      
      // Fetch pending submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('song_submissions')
        .select(`
          *,
          users!song_submissions_artist_id_fkey(email, role)
        `)
        .order('submitted_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch approved songs
      const { data: songsData, error: songsError } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (songsError) throw songsError;

      setSubmissions(submissionsData || []);
      setSongs(songsData || []);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmission = (submission, actionType) => {
    setSelectedSubmission(submission);
    setAction(actionType);
    setAdminNotes('');
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('song_submissions')
        .update({
          status: action,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', selectedSubmission.id);

      if (error) throw error;

      // If approved, create the song
      if (action === 'approved') {
        const { error: createError } = await supabase.rpc('create_song_from_submission', {
          submission_id: selectedSubmission.id,
          admin_user_id: user.id
        });

        if (createError) throw createError;
      }

      setReviewDialogOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (audioUrl) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'revision_requested': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      y: -4,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

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
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div variants={itemVariants}>
              <AdminPanelSettings sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
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
                Admin Dashboard
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={adminRole === 'super_admin' ? 'Super Admin' : 'Admin'}
                  color={adminRole === 'super_admin' ? 'error' : 'primary'}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 2,
                    py: 1
                  }}
                />
                {adminRole === 'super_admin' && (
                  <Chip
                    label="Full Access"
                    color="success"
                    variant="outlined"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                {adminRole === 'super_admin' 
                  ? 'Full platform management and oversight capabilities'
                  : 'Review song submissions and manage the platform'
                }
              </Typography>
            </motion.div>
          </Box>

          {/* Super Admin Privileges Display */}
          {adminRole === 'super_admin' && (
            <motion.div variants={itemVariants} sx={{ mb: 4 }}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.1))',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                  🚀 Super Admin Privileges
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(adminPermissions).map(([permission, hasAccess]) => (
                    hasAccess && (
                      <Chip
                        key={permission}
                        label={permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        color="success"
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    )
                  ))}
                </Box>
              </Card>
            </motion.div>
          )}

          {/* Tabs */}
          <Box sx={{ mb: 4 }}>
            <motion.div variants={itemVariants}>
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 500,
                    '&.Mui-selected': {
                      color: 'white',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                <Tab label={`Pending Submissions (${submissions.filter(s => s.status === 'pending').length})`} />
                <Tab label={`Approved Songs (${songs.length})`} />
                {adminRole === 'super_admin' && (
                  <Tab label="System Management" />
                )}
              </Tabs>
            </motion.div>
          </Box>

          {/* Content */}
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              {submissions.filter(s => s.status === 'pending').map((submission) => (
                <Grid item xs={12} md={6} key={submission.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        {submission.cover_image_url && (
                          <Box
                            component="img"
                            src={submission.cover_image_url}
                            alt={submission.title}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                          }}
                        >
                          <Chip
                            label={submission.status}
                            color={getStatusColor(submission.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        {submission.audio_file_url && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 16,
                              right: 16,
                            }}
                          >
                            <IconButton
                              onClick={() => handlePlayPause(submission.audio_file_url)}
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                },
                              }}
                            >
                              {playingAudio === submission.audio_file_url ? <Pause /> : <PlayArrow />}
                            </IconButton>
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {submission.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 2,
                          }}
                        >
                          by {submission.users?.email}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 3,
                            lineHeight: 1.6,
                          }}
                        >
                          {submission.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Genre
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              {submission.genre}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Price per Token
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              ${submission.proposed_price_per_token_usd}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Total Tokens
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              {submission.proposed_total_tokens.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Submitted
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              {formatDate(submission.submitted_at)}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => handleReviewSubmission(submission, 'approved')}
                            sx={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #047857, #065f46)',
                              },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<Cancel />}
                            onClick={() => handleReviewSubmission(submission, 'rejected')}
                            sx={{
                              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                              },
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => handleReviewSubmission(submission, 'revision_requested')}
                            sx={{
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                borderColor: 'primary.main',
                                color: 'primary.main',
                              },
                            }}
                          >
                            Request Revision
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {selectedTab === 1 && (
            <Grid container spacing={3}>
              {songs.map((song) => (
                <Grid item xs={12} md={6} key={song.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        {song.cover_image_url && (
                          <Box
                            component="img"
                            src={song.cover_image_url}
                            alt={song.title}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                          }}
                        >
                          <Chip
                            label={song.status}
                            color={getStatusColor(song.status)}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {song.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            mb: 2,
                          }}
                        >
                          by {song.artist_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 3,
                            lineHeight: 1.6,
                          }}
                        >
                          {song.description}
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Price per Token
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              ${song.price_per_token_usd}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Tokens Sold
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              {song.tokens_sold} / {song.total_tokens}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              Approved
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                              {formatDate(song.approved_at)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* System Management Tab - Super Admin Only */}
          {selectedTab === 2 && adminRole === 'super_admin' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div variants={cardVariants}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      👥 User Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                      Manage users, roles, and permissions across the platform.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                        },
                      }}
                    >
                      Manage Users
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={cardVariants}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      📊 Analytics & Reports
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                      View platform analytics, user engagement, and business metrics.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #047857, #065f46)',
                        },
                      }}
                    >
                      View Analytics
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={cardVariants}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      ⚙️ System Settings
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                      Configure platform settings, features, and system parameters.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #d97706, #b45309)',
                        },
                      }}
                    >
                      System Settings
                    </Button>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div variants={cardVariants}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      p: 3,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                      🔒 Security & Compliance
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}>
                      Monitor security, handle violations, and ensure compliance.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        },
                      }}
                    >
                      Security Center
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          )}

          {/* Review Dialog */}
          <Dialog
            open={reviewDialogOpen}
            onClose={() => setReviewDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle sx={{ color: 'white', fontWeight: 600 }}>
              Review Submission
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Admin Notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                sx={{
                  mt: 2,
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
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setReviewDialogOpen(false)}
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                variant="contained"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                  },
                }}
              >
                {loading ? 'Processing...' : 'Submit Review'}
              </Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
