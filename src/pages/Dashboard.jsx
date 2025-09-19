import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Container,
} from '@mui/material';
import {
  MusicNote,
  TrendingUp,
  AccountBalanceWallet,
  People,
  BarChart,
  Shield,
  Build,
  AttachMoney,
  Visibility,
  ThumbUp,
  Comment,
  Share,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Analytics,
  Timeline,
  PieChart,
  ShowChart,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import WalletCreation from '../components/WalletCreation';
import SongSubmission from '../components/SongSubmission';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data for demonstration - replace with real API calls
  const mockFanData = {
    totalTokens: 1250,
    totalInvested: 12500,
    activeInvestments: 8,
    totalEarnings: 2500,
    portfolioValue: 15000,
    recentPurchases: [
      { song: "Summer Vibes", artist: "DJ Cool", tokens: 100, price: 1000, date: "2024-01-15" },
      { song: "Night Dreams", artist: "Singer Pro", tokens: 50, price: 500, date: "2024-01-14" },
      { song: "City Lights", artist: "Urban Beat", tokens: 200, price: 2000, date: "2024-01-13" },
    ],
    tokenPerformance: [
      { month: 'Jan', value: 10000, tokens: 800 },
      { month: 'Feb', value: 12000, tokens: 950 },
      { month: 'Mar', value: 15000, tokens: 1200 },
      { month: 'Apr', value: 18000, tokens: 1400 },
      { month: 'May', value: 22000, tokens: 1700 },
      { month: 'Jun', value: 25000, tokens: 2000 },
    ],
    topPerformingTokens: [
      { name: "Summer Vibes", artist: "DJ Cool", return: 45.2, value: 1450 },
      { name: "City Lights", artist: "Urban Beat", return: 32.8, value: 1328 },
      { name: "Night Dreams", artist: "Singer Pro", return: 28.5, value: 1285 },
    ]
  };

  const mockArtistData = {
    totalFans: 1250,
    totalRevenue: 25000,
    songsCreated: 12,
    totalTokensSold: 5000,
    averageTokenPrice: 5.0,
    recentActivity: [
      { fan: "MusicLover123", song: "Summer Vibes", tokens: 100, amount: 1000, date: "2024-01-15" },
      { fan: "BeatFan456", song: "Night Dreams", tokens: 50, amount: 500, date: "2024-01-14" },
      { fan: "SoundWave789", song: "City Lights", tokens: 200, amount: 2000, date: "2024-01-13" },
    ],
    revenueChart: [
      { month: 'Jan', revenue: 5000, fans: 200 },
      { month: 'Feb', revenue: 7500, fans: 350 },
      { month: 'Mar', revenue: 12000, fans: 500 },
      { month: 'Apr', revenue: 18000, fans: 750 },
      { month: 'May', revenue: 22000, fans: 900 },
      { month: 'Jun', revenue: 25000, fans: 1250 },
    ],
    fanDemographics: [
      { age: '18-24', percentage: 35, count: 438 },
      { age: '25-34', percentage: 40, count: 500 },
      { age: '35-44', percentage: 20, count: 250 },
      { age: '45+', percentage: 5, count: 62 },
    ],
    topSongs: [
      { name: "Summer Vibes", tokensSold: 1200, revenue: 12000, fans: 300 },
      { name: "City Lights", tokensSold: 800, revenue: 8000, fans: 200 },
      { name: "Night Dreams", tokensSold: 600, revenue: 6000, fans: 150 },
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Default to fan data if role is missing or undefined
      const role = userProfile?.role || 'fan';
      console.log('Dashboard - setting analytics data for role:', role);
      
      if (role === 'creator') {
        setAnalyticsData(mockArtistData);
      } else {
        setAnalyticsData(mockFanData);
      }
      setLoading(false);
    };

    if (userProfile) {
      fetchAnalytics();
    }
  }, [userProfile, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Debug logging
  console.log('Dashboard - userProfile:', userProfile);
  console.log('Dashboard - userProfile.profile:', userProfile?.profile);

  if (!userProfile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading your profile...
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}>
          This may take a few moments
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 2, fontSize: '0.8rem' }}>
          Debug: userProfile is {userProfile === null ? 'null' : userProfile === undefined ? 'undefined' : 'present'}
        </Typography>
      </Box>
    );
  }

  // If KYC is not complete, redirect to KYC
  if (userProfile && !userProfile.is_kyc_complete) {
    return <Navigate to="/kyc" replace />;
  }

  // If we have a userProfile but it's incomplete, show a basic dashboard
  if (userProfile && !userProfile.role) {
    console.log('Dashboard - userProfile exists but role is missing, showing basic dashboard');
  }

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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderFanDashboard = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Fan Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Track your music investments and portfolio performance
            </Typography>
          </Box>
          <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
            <Refresh />
          </IconButton>
        </Box>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceWallet sx={{ color: '#10b981', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Portfolio Value</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ${analyticsData?.portfolioValue?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +18.2% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MusicNote sx={{ color: '#3b82f6', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Total Tokens</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {analyticsData?.totalTokens?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Across {analyticsData?.activeInvestments || 0} songs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ color: '#f59e0b', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Total Invested</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ${analyticsData?.totalInvested?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +5.8% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUp sx={{ color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Total Earnings</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ${analyticsData?.totalEarnings?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +22.1% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Portfolio Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData?.tokenPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.7)" />
                    <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      fill="rgba(59, 130, 246, 0.2)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Top Performing Tokens
                </Typography>
                <List>
                  {analyticsData?.topPerformingTokens?.map((token, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length], width: 32, height: 32 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {index + 1}
                          </Typography>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                            {token.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              by {token.artist}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <TrendingUp sx={{ color: '#10b981', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                +{token.return}%
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                ${token.value}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Recent Purchases
            </Typography>
            <List>
              {analyticsData?.recentPurchases?.map((purchase, index) => (
                <ListItem key={index} sx={{ px: 0, py: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                      <MusicNote />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {purchase.song}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          by {purchase.artist} • {purchase.tokens} tokens • ${purchase.price}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {purchase.date}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip 
                    label="Completed" 
                    color="success" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Creation */}
      <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
        <WalletCreation />
      </motion.div>
    </motion.div>
  );

  const renderArtistDashboard = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Artist Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Manage your music, track fan engagement, and grow your audience
            </Typography>
          </Box>
          <IconButton onClick={handleRefresh} sx={{ color: 'white' }}>
            <Refresh />
          </IconButton>
        </Box>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ color: '#10b981', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Total Revenue</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  ${analyticsData?.totalRevenue?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +12.5% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <People sx={{ color: '#3b82f6', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Total Fans</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {analyticsData?.totalFans?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +8.2% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MusicNote sx={{ color: '#f59e0b', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Songs Created</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {analyticsData?.songsCreated || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  3 this month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card elevation={8} sx={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceWallet sx={{ color: '#8b5cf6', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>Tokens Sold</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                  {analyticsData?.totalTokensSold?.toLocaleString() || '0'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +15.3% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Revenue & Fan Growth
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.revenueChart || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.7)" />
                    <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Revenue ($)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fans" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Fans"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Fan Demographics
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <RechartsPie
                      data={analyticsData?.fanDemographics || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {(analyticsData?.fanDemographics || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <Box sx={{ mt: 2 }}>
                  {(analyticsData?.fanDemographics || []).map((demo, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          bgcolor: COLORS[index % COLORS.length], 
                          borderRadius: '50%', 
                          mr: 1 
                        }} 
                      />
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {demo.age}: {demo.percentage}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Top Songs */}
      <motion.div variants={itemVariants}>
        <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Top Performing Songs
            </Typography>
            <Grid container spacing={2}>
              {(analyticsData?.topSongs || []).map((song, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card elevation={4} sx={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: COLORS[index % COLORS.length], mr: 2 }}>
                          {index + 1}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                            {song.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Tokens Sold:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {song.tokensSold.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Revenue:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          ${song.revenue.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Fans:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {song.fans}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card elevation={8} sx={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)' }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Recent Fan Activity
            </Typography>
            <List>
              {(analyticsData?.recentActivity || []).map((activity, index) => (
                <ListItem key={index} sx={{ px: 0, py: 2 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                      <People />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                        {activity.fan} purchased tokens
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {activity.song} • {activity.tokens} tokens • ${activity.amount}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {activity.date}
                        </Typography>
                      </Box>
                    }
                  />
                  <Chip 
                    label="New" 
                    color="primary" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </motion.div>

      {/* Song Submission */}
      <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
        <SongSubmission />
      </motion.div>

      {/* Wallet Creation */}
      <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
        <WalletCreation />
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading your dashboard...
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
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {userProfile?.role === 'creator' ? renderArtistDashboard() : renderFanDashboard()}
      </Container>
    </Box>
  );
};

export default Dashboard;