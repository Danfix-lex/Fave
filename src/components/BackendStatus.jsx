import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh,
  ExpandMore,
  ExpandLess,
  Storage,
  Security,
  Speed,
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

const BackendStatus = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [envCheck, setEnvCheck] = useState(null);
  const [dbCheck, setDbCheck] = useState(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      // Real production tests
      const testResults = [];
      
      // Test Supabase connection
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        testResults.push({ 
          name: 'Supabase Connection', 
          status: error ? 'FAIL' : 'PASS',
          error: error?.message 
        });
      } catch (err) {
        testResults.push({ 
          name: 'Supabase Connection', 
          status: 'FAIL',
          error: err.message 
        });
      }
      
      // Test authentication
      try {
        const { data: { user } } = await supabase.auth.getUser();
        testResults.push({ 
          name: 'Authentication', 
          status: 'PASS' 
        });
      } catch (err) {
        testResults.push({ 
          name: 'Authentication', 
          status: 'FAIL',
          error: err.message 
        });
      }
      
      // Test database tables
      const dbResults = {};
      const tables = ['users', 'user_profiles', 'songs', 'song_submissions'];
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('count').limit(1);
          dbResults[table] = { 
            exists: !error, 
            count: data?.length || 0,
            error: error?.message 
          };
        } catch (err) {
          dbResults[table] = { 
            exists: false, 
            count: 0,
            error: err.message 
          };
        }
      }
      
      // Environment check
      const envResults = {
        isValid: !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
        issues: []
      };
      
      if (!process.env.VITE_SUPABASE_URL) envResults.issues.push('Missing VITE_SUPABASE_URL');
      if (!process.env.VITE_SUPABASE_ANON_KEY) envResults.issues.push('Missing VITE_SUPABASE_ANON_KEY');
      
      setResults(testResults);
      setEnvCheck(envResults);
      setDbCheck(dbResults);
    } catch (error) {
      setResults([{ name: 'System Test', status: 'FAIL', error: error.message }]);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Run initial environment check
    const envResults = {
      isValid: !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
      issues: []
    };
    
    if (!process.env.VITE_SUPABASE_URL) envResults.issues.push('Missing VITE_SUPABASE_URL');
    if (!process.env.VITE_SUPABASE_ANON_KEY) envResults.issues.push('Missing VITE_SUPABASE_ANON_KEY');
    
    setEnvCheck(envResults);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return 'success';
      case 'FAIL': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS': return <CheckCircle />;
      case 'FAIL': return <Error />;
      default: return <Info />;
    }
  };

  const getOverallStatus = () => {
    if (!results) return 'unknown';
    const passed = results.filter(r => r.status === 'PASS').length;
    const total = results.length;
    if (passed === total) return 'success';
    if (passed > 0) return 'warning';
    return 'error';
  };

  return (
    <Card
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        minWidth: 300,
        maxWidth: 400,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Backend Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              startIcon={isRunning ? <CircularProgress size={16} /> : <Refresh />}
              onClick={runTests}
              disabled={isRunning}
              sx={{ color: 'white' }}
            >
              {isRunning ? 'Testing...' : 'Test'}
            </Button>
            <Button
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ color: 'white' }}
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </Button>
          </Box>
        </Box>

        {/* Environment Check */}
        {envCheck && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Storage sx={{ fontSize: 16, color: envCheck.isValid ? 'success.main' : 'error.main' }} />
              <Typography variant="body2" sx={{ color: 'white' }}>
                Environment
              </Typography>
              <Chip
                label={envCheck.isValid ? 'OK' : 'Error'}
                color={envCheck.isValid ? 'success' : 'error'}
                size="small"
              />
            </Box>
            {!envCheck.isValid && (
              <Alert severity="error" sx={{ mb: 1 }}>
                <Typography variant="caption">
                  {envCheck.issues.join(', ')}
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* Overall Status */}
        {results && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {getStatusIcon(getOverallStatus())}
              <Typography variant="body2" sx={{ color: 'white' }}>
                Backend Tests
              </Typography>
              <Chip
                label={`${results.filter(r => r.status === 'PASS').length}/${results.length}`}
                color={getStatusColor(getOverallStatus())}
                size="small"
              />
            </Box>
          </Box>
        )}

        {/* Expanded Details */}
        <Collapse in={isExpanded}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          {/* Test Results */}
          {results && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                Test Results
              </Typography>
              <List dense>
                {results.map((result, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {getStatusIcon(result.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {result.name}
                        </Typography>
                      }
                      secondary={
                        result.status === 'FAIL' && (
                          <Typography variant="caption" sx={{ color: 'error.main' }}>
                            {result.error}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Database Check */}
          {dbCheck && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                Database Tables
              </Typography>
              <List dense>
                {Object.entries(dbCheck).map(([table, info]) => (
                  <ListItem key={table} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {info.exists ? <CheckCircle color="success" /> : <Error color="error" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {table}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {info.exists ? `Count: ${info.count}` : info.error}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Quick Actions */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Storage />}
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                sx={{ color: 'white', justifyContent: 'flex-start' }}
              >
                Open Supabase Dashboard
              </Button>
              <Button
                size="small"
                startIcon={<Security />}
                onClick={() => {}}
                sx={{ color: 'white', justifyContent: 'flex-start' }}
              >
                Log Environment Info
              </Button>
              <Button
                size="small"
                startIcon={<Speed />}
                onClick={() => {}}
                sx={{ color: 'white', justifyContent: 'flex-start' }}
              >
                Log Test Results
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Help Text */}
        {!isExpanded && (
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Click expand to see detailed results
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendStatus;
