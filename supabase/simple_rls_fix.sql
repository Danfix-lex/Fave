-- Simple RLS Fix for User Creation
-- This is the minimal fix needed to allow user creation during signup

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';

-- Drop ALL existing policies on users table
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can view own email" ON users;
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create a simple policy that allows inserts from anyone (for signup)
CREATE POLICY "Allow user creation" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy that allows users to see only their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Create a policy that allows users to update only their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT INSERT ON users TO anon;
GRANT SELECT ON users TO anon;
GRANT UPDATE ON users TO anon;

-- Test message
SELECT 'RLS policies updated successfully' as status;
