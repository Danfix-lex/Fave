import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  InputBase,
  IconButton,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  Pause,
  Favorite,
  Share,
  CalendarToday,
  Person,
  MusicNote,
  FilterList,
} from '@mui/icons-material';

const Upcoming = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingTrack, setPlayingTrack] = useState(null);

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
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const upcomingSongs = [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Luna Star",
      genre: "Electronic",
      releaseDate: "2024-02-15",
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      artistImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description: "A mesmerizing electronic journey through the night sky.",
      tokensAvailable: 1000,
      tokensSold: 750,
      pricePerToken: 0.1,
      status: "Live",
    },
    {
      id: 2,
      title: "City Lights",
      artist: "Urban Beats",
      genre: "Hip-Hop",
      releaseDate: "2024-02-20",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
      artistImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Raw energy and authentic street vibes in this upcoming hit.",
      tokensAvailable: 2000,
      tokensSold: 1200,
      pricePerToken: 0.05,
      status: "Live",
    },
    {
      id: 3,
      title: "Ocean Waves",
      artist: "Marina Blue",
      genre: "Indie",
      releaseDate: "2024-02-25",
      coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
      artistImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Dreamy indie melodies that capture the essence of the sea.",
      tokensAvailable: 1500,
      tokensSold: 0,
      pricePerToken: 0.08,
      status: "Coming Soon",
    },
    {
      id: 4,
      title: "Digital Love",
      artist: "Cyber Pop",
      genre: "Pop",
      releaseDate: "2024-03-01",
      coverImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
      artistImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "A futuristic pop anthem about love in the digital age.",
      tokensAvailable: 3000,
      tokensSold: 2100,
      pricePerToken: 0.12,
      status: "Live",
    },
    {
      id: 5,
      title: "Mountain High",
      artist: "Peak Sounds",
      genre: "Rock",
      releaseDate: "2024-03-05",
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      artistImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Powerful rock anthem that reaches for the sky.",
      tokensAvailable: 1800,
      tokensSold: 0,
      pricePerToken: 0.15,
      status: "Coming Soon",
    },
    {
      id: 6,
      title: "Jazz Nights",
      artist: "Smooth Sax",
      genre: "Jazz",
      releaseDate: "2024-03-10",
      coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      artistImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description: "Smooth jazz melodies perfect for late-night listening.",
      tokensAvailable: 1200,
      tokensSold: 800,
      pricePerToken: 0.09,
      status: "Live",
    },
  ];

  const genres = ['All', 'Electronic', 'Hip-Hop', 'Indie', 'Pop', 'Rock', 'Jazz'];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePlayPause = (trackId) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  const filteredSongs = upcomingSongs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedTab === 0 || song.genre === genres[selectedTab];
    return matchesSearch && matchesGenre;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Live': return 'success';
      case 'Coming Soon': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          {/* Header */}
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
                Upcoming Songs
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.7,
                }}
              >
                Discover and invest in the next big hits from talented artists around the world.
              </Typography>
            </motion.div>
          </Box>

          {/* Search and Filter */}
          <Box sx={{ mb: 6 }}>
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                        }}
                      >
                        <Search sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
                        <InputBase
                          placeholder="Search songs, artists, or genres..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          sx={{
                            color: 'white',
                            flex: 1,
                            '& input::placeholder': {
                              color: 'rgba(255, 255, 255, 0.6)',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                        <Button
                          startIcon={<FilterList />}
                          sx={{
                            color: 'white',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                          variant="outlined"
                        >
                          Filter
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Genre Tabs */}
          <Box sx={{ mb: 6 }}>
            <motion.div variants={itemVariants}>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
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
                {genres.map((genre, index) => (
                  <Tab key={genre} label={genre} />
                ))}
              </Tabs>
            </motion.div>
          </Box>

          {/* Songs Grid */}
          <Grid container spacing={4}>
            {filteredSongs.map((song, index) => (
              <Grid item xs={12} sm={6} md={4} key={song.id}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card
                    sx={{
                      height: '100%',
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
                      <CardMedia
                        component="img"
                        height="200"
                        image={song.coverImage}
                        alt={song.title}
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
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
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                        }}
                      >
                        <IconButton
                          onClick={() => handlePlayPause(song.id)}
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            },
                          }}
                        >
                          {playingTrack === song.id ? <Pause /> : <PlayArrow />}
                        </IconButton>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={song.artistImage}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'white',
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {song.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            {song.artist}
                          </Typography>
                        </Box>
                      </Box>

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
                            Release Date
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                            {formatDate(song.releaseDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Price per Token
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                            ${song.pricePerToken}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Tokens Sold
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                            {song.tokensSold} / {song.tokensAvailable}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            background: 'linear-gradient(135deg, #3b82f6, #a855f7)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
                            },
                          }}
                        >
                          Invest Now
                        </Button>
                        <IconButton
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          <Favorite />
                        </IconButton>
                        <IconButton
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          <Share />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {filteredSongs.length === 0 && (
            <motion.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <MusicNote sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No songs found matching your criteria
                </Typography>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Upcoming;
