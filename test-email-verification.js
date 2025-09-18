// Test script to verify email verification flow
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailVerification() {
  console.log('Testing email verification flow...');
  
  try {
    // Test 1: Sign up a user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    console.log('1. Testing signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:5174/auth/callback'
      }
    });
    
    if (signupError) {
      console.error('Signup error:', signupError);
      return;
    }
    
    console.log('✅ Signup successful:', signupData.user?.email);
    console.log('User confirmed:', signupData.user?.email_confirmed_at);
    
    // Test 2: Check if user was created in database
    console.log('2. Checking database user record...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signupData.user.id)
      .single();
    
    if (userError) {
      console.log('❌ User not found in database:', userError.message);
    } else {
      console.log('✅ User found in database:', userData);
    }
    
    // Test 3: Simulate email verification (this would normally be done by clicking the email link)
    console.log('3. Testing email verification...');
    console.log('Note: In real flow, user would click email link which contains token');
    console.log('The email link would redirect to: http://localhost:5174/auth/callback?token=...&type=signup');
    
    console.log('✅ Email verification flow test completed');
    console.log('Next steps:');
    console.log('1. Check your email for verification link');
    console.log('2. Click the link to test the verification process');
    console.log('3. Verify that user gets authenticated and redirected to sign-in');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEmailVerification();
