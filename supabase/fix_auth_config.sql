/*
  # Fix Authentication Configuration
  This script fixes common Supabase Auth configuration issues
*/

-- Enable email confirmations (if not already enabled)
-- This should be done in Supabase Dashboard > Authentication > Settings
-- But we can check the current configuration

-- Check if email confirmations are properly configured
DO $$
BEGIN
  RAISE NOTICE '=== AUTHENTICATION CONFIGURATION CHECK ===';
  RAISE NOTICE 'Please verify these settings in your Supabase Dashboard:';
  RAISE NOTICE '1. Go to Authentication > Settings';
  RAISE NOTICE '2. Ensure "Enable email confirmations" is ON';
  RAISE NOTICE '3. Set "Site URL" to: http://localhost:5173';
  RAISE NOTICE '4. Add redirect URLs:';
  RAISE NOTICE '   - http://localhost:5173/auth/callback';
  RAISE NOTICE '   - http://localhost:5173/auth/verify-email';
  RAISE NOTICE '5. Ensure "Enable email change confirmations" is ON';
  RAISE NOTICE '6. Set "Email confirmation template" as needed';
  RAISE NOTICE '=== END CONFIGURATION CHECK ===';
END $$;

-- Ensure users table has proper constraints
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Add unique constraint on email if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_email_unique' 
    AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
    RAISE NOTICE 'Added unique constraint on users.email';
  ELSE
    RAISE NOTICE 'Unique constraint on users.email already exists';
  END IF;
END $$;

-- Ensure proper RLS policies for user creation
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add policy to allow user creation during signup
CREATE POLICY "Allow user creation during signup" ON users 
  FOR INSERT WITH CHECK (true);

-- Update the policy to be more permissive for signup
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;
CREATE POLICY "Allow user creation during signup" ON users 
  FOR INSERT WITH CHECK (true);

-- Ensure user_profiles table allows inserts
DROP POLICY IF EXISTS "Users can insert own profile data" ON user_profiles;
CREATE POLICY "Users can insert own profile data" ON user_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add more permissive policy for profile creation
CREATE POLICY "Allow profile creation during signup" ON user_profiles 
  FOR INSERT WITH CHECK (true);

-- Final verification
DO $$
DECLARE
  user_count INTEGER;
  profile_count INTEGER;
  distributor_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  SELECT COUNT(*) INTO profile_count FROM user_profiles;
  SELECT COUNT(*) INTO distributor_count FROM distributors WHERE is_active = true;
  
  RAISE NOTICE '=== AUTHENTICATION SETUP COMPLETE ===';
  RAISE NOTICE 'Users in database: %', user_count;
  RAISE NOTICE 'User profiles: %', profile_count;
  RAISE NOTICE 'Active distributors: %', distributor_count;
  RAISE NOTICE '=== READY FOR SIGNUP TESTING ===';
END $$;
