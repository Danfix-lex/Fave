import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasValidConfig) {
  // Option A: throw to fail fast
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  // Option B: return a noop client or skip export (choose one approach)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  db: { schema: 'public' },
  global: {
    headers: {
      'X-Client-Info': 'fave-platform@1.0.0',
      Accept: 'application/json',
    },
  },
});

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { error, count } = await supabase
      .from('distributors') // ensure this table exists
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data: { count } };
  } catch (error) {
    return { success: false, error };
  }
};

// Enhanced error handling wrapper
export const handleSupabaseError = (error, operation = 'operation') => {
  
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return { message: 'No data found', code: 'NOT_FOUND' };
      case '23505':
        return { message: 'Record already exists', code: 'DUPLICATE' };
      case '23503':
        return { message: 'Referenced record not found', code: 'FOREIGN_KEY' };
      case '42501':
        return { message: 'Insufficient permissions', code: 'PERMISSION_DENIED' };
      case 'PGRST301':
        return { message: 'Row Level Security policy violation', code: 'RLS_VIOLATION' };
      default:
        return { message: error.message || 'Unknown error occurred', code: error.code };
    }
  }
  
  return { message: error.message || 'An unexpected error occurred', code: 'UNKNOWN' };
};

// Resolve an OAuth redirect URL
const getOAuthRedirectUrl = () => {
  try {
    const configuredUrl = import.meta.env.VITE_SITE_REDIRECT_URL;
    if (configuredUrl) {
      return configuredUrl.replace(/\/$/, '') + '/';
    }
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin + '/';
    }
  } catch (_) {
    // ignore and fall through
  }
  return undefined;
};

// Start Google OAuth sign-in/signup flow
export const signInWithGoogle = async (role) => {
  try {
    const baseUrl = getOAuthRedirectUrl();
    const cleanBase = baseUrl ? baseUrl.replace(/\/$/, '') : undefined;
    const redirectTo = cleanBase ? `${cleanBase}/auth/callback${role ? `?role=${encodeURIComponent(role)}` : ''}` : undefined;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://krjqftbmkeomwjnqeira.supabase.co/auth/v1/callback',
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    });

    if (error) {
      return { success: false, error: handleSupabaseError(error, 'google sign-in') };
    }

    // In browser, this typically triggers a redirect. `data.url` contains the target URL.
    return { success: true, data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error, 'google sign-in') };
  }
};

// Initialize session after returning from OAuth redirect
export const initializeAuthFromRedirect = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { success: false, error: handleSupabaseError(error, 'initialize session') };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error, 'initialize session') };
  }
};
