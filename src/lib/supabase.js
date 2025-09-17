import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasValidConfig) {
  console.error('❌ Missing or invalid Supabase environment variables!');
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
      console.error('❌ Supabase connection failed:', error);
      return { success: false, error };
    }

    console.log('✅ Supabase connection successful');
    return { success: true, data: { count } };
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return { success: false, error };
  }
};

// Enhanced error handling wrapper
export const handleSupabaseError = (error, operation = 'operation') => {
  console.error(`❌ Supabase ${operation} error:`, error);
  
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
