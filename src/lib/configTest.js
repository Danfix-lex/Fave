// Configuration Test for Supabase
import { supabase } from './supabase';

export const testSupabaseConfig = async () => {
  console.log('🔍 Testing Supabase Configuration...');
  
  try {
    // Test 1: Check if Supabase client is properly initialized
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    console.log('✅ Supabase client initialized');
    
    // Test 2: Test database connection using count header
    const { error } = await supabase
      .from('distributors')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection successful');
    
    // Test 3: Test authentication system
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      throw new Error(`Authentication system error: ${authError.message}`);
    }
    
    console.log('✅ Authentication system working');
    
    // Test 4: Check environment variables
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!url || !key || 
        url.includes('your-project-ref') || 
        key.includes('your-anon-key')) {
      throw new Error('Environment variables not properly configured');
    }
    
    console.log('✅ Environment variables configured');
    console.log('🎉 All tests passed! Supabase is ready to use.');
    
    return {
      success: true,
      message: 'Supabase configuration is working perfectly!'
    };
    
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Auto-run test when imported
if (import.meta.env.DEV) {
  testSupabaseConfig();
}
