import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const finalizeLogin = async () => {
      try {
        const url = new URL(window.location.href);
        const role = url.searchParams.get('role') || 'fan';
        const code = url.searchParams.get('code');
        const errorDescription = url.searchParams.get('error_description');

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        // For PKCE/OAuth, supabase-js handles code exchange automatically when detectSessionInUrl is true.
        // Ensure session is available.
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        // If session not present yet, try to wait briefly and re-check.
        if (!session) {
          await new Promise(r => setTimeout(r, 400));
        }

        const { data: { session: session2 }, error: error2 } = await supabase.auth.getSession();
        if (error2) throw error2;
        const activeSession = session2;

        if (!activeSession?.user) {
          // Fallback: attempt exchange explicitly (rarely needed with v2)
          if (code) {
            // Nothing to call directly; supabase handles via URL hash parsing. Show error if still missing.
            throw new Error('Unable to establish session from OAuth callback.');
          }
          throw new Error('No active session found after OAuth.');
        }

        // Upsert user record with role, if your DB expects it
        try {
          await supabase.from('users').upsert([
            {
              id: activeSession.user.id,
              email: activeSession.user.email,
              role,
              is_kyc_complete: false,
              updated_at: new Date().toISOString(),
            },
          ], { onConflict: 'id' });
        } catch (e) {
          // non-fatal
        }

        // Redirect post-login to Dashboard
        window.location.replace('/dashboard');
      } catch (e) {
        setError(e.message || 'Authentication failed');
      }
    };

    finalizeLogin();
  }, [navigate, location.search]);

  return (
    <Box sx={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
    }}>
      {!error ? (
        <>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography sx={{ color: 'white' }}>Signing you in with Google…</Typography>
        </>
      ) : (
        <Alert severity="error">{error}</Alert>
      )}
    </Box>
  );
};

export default AuthCallback;


