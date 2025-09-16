import { createClient } from '@supabase/supabase-js';

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

// Validate environment variables
const hasValidConfig = import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-ref.supabase.co' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key-here';

if (!hasValidConfig) {
  console.error('❌ Missing or invalid Supabase environment variables!');
  console.error('Please create a .env file in your project root with:');
  console.error('VITE_SUPABASE_URL=your_actual_supabase_project_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key');
  console.error('');
  console.error('You can get these values from your Supabase project dashboard:');
  console.error('1. Go to https://supabase.com/dashboard');
  console.error('2. Select your project');
  console.error('3. Go to Settings > API');
  console.error('4. Copy the Project URL and anon public key');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'fave-platform@1.0.0',
      'Accept': 'application/json'
    }
  }
});

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return { success: false, error };
    }
    
    console.log('✅ Supabase connection successful');
    return { success: true, data };
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
