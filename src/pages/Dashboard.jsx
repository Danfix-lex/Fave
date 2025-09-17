import React, { useState } from 'react';
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
} from '@mui/material';
import {
  MusicNote,
  TrendingUp,
  AccountBalanceWallet,
  People,
  BarChart,
  Shield,
  Build,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { runBackendTests } from '../lib/backendTest.js';
import WalletCreation from '../components/WalletCreation';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleRunTests = async () => {
    setTesting(true);
    const results = await runBackendTests();
    setTestResults(results);
    setTesting(false);
  };

  if (!userProfile) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (!userProfile.is_kyc_complete) {
    return <Navigate to="/kyc" replace />;
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

  const getRoleSpecificContent = () => {
    switch (userProfile.role) {
      case 'creator':
        return (
          <motion.div variants={containerVariants}>
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Creator Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                  Welcome back! Here's your creator overview.
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                          border: '1px solid',
                          borderColor: 'primary.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MusicNote sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.900' }}>
                              Active Projects
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.600' }}>
                            0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          border: '1px solid',
                          borderColor: 'success.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.900' }}>
                              Total Raised
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.600' }}>
                            ₦0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                          border: '1px solid',
                          borderColor: 'secondary.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccountBalanceWallet sx={{ color: 'secondary.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.900' }}>
                              Revenue Earned
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.600' }}>
                            ₦0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'fan':
        return (
          <motion.div variants={containerVariants}>
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Fan Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                  Welcome back! Here's your investment overview.
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                          border: '1px solid',
                          borderColor: 'primary.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MusicNote sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.900' }}>
                              Projects Invested
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.600' }}>
                            0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          border: '1px solid',
                          borderColor: 'success.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.900' }}>
                              Total Invested
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.600' }}>
                            ₦0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                          border: '1px solid',
                          borderColor: 'warning.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccountBalanceWallet sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.900' }}>
                              Wallet Balance
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.600' }}>
                            ₦0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'admin':
        return (
          <motion.div variants={containerVariants}>
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                  Platform overview and management tools.
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                          border: '1px solid',
                          borderColor: 'primary.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <People sx={{ color: 'primary.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.900' }}>
                              Total Users
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.600' }}>
                            0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                          border: '1px solid',
                          borderColor: 'success.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MusicNote sx={{ color: 'success.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.900' }}>
                              Active Projects
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.600' }}>
                            0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                          border: '1px solid',
                          borderColor: 'warning.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Shield sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.900' }}>
                              Pending Approvals
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.600' }}>
                            0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div variants={cardVariants} whileHover="hover">
                      <Card
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                          border: '1px solid',
                          borderColor: 'secondary.200',
                        }}
                      >
                        <CardContent sx={{ p: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <BarChart sx={{ color: 'secondary.main', mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.900' }}>
                              Total Volume
                            </Typography>
                          </Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.600' }}>
                            ₦0
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h5">Backend Status</Typography>
                <Button
                  variant="contained"
                  onClick={handleRunTests}
                  disabled={testing}
                  startIcon={testing ? <CircularProgress size={20} /> : <Build />}
                >
                  {testing ? 'Running Tests...' : 'Run Backend Tests'}
                </Button>
                {testResults && (
                  <Box mt={2}>
                    <Typography variant="h6">Test Results</Typography>
                    {testResults.map((result, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          sx={{
                            color: result.status === 'PASS' ? 'success.main' : 'error.main',
                          }}
                        >
                          {result.status}
                        </Typography>
                        <Typography sx={{ ml: 1 }}>{result.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      default:
        return (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Welcome to your dashboard!
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <Box sx={{ 
      px: { xs: 2, sm: 0 },
      position: 'relative',
      zIndex: 1,
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 4 }}>
          <motion.div variants={itemVariants}>
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
            >
              Welcome back, {userProfile.profile?.full_name || 'User'}!
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Here's what's happening with your
              </Typography>
              <Chip
                label={userProfile.role}
                color="primary"
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                account.
              </Typography>
            </Box>
          </motion.div>
        </Box>

        {getRoleSpecificContent()}

        {/* Wallet Creation Section */}
        <motion.div variants={itemVariants} sx={{ mt: 4 }}>
          <WalletCreation userProfile={userProfile} />
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
